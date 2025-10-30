import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatsCard } from "@/components/StatsCard";
import { ProductCard } from "@/components/ProductCard";
import { ScannerInterface } from "@/components/ScannerInterface";
import { RequestPickupDialog } from "@/components/RequestPickupDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Recycle, Truck, DollarSign, Scan, MapPin, Loader2, Plus, X, Award, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getUserEmail, getUserRole } from './LoginPage';

type Product = {
  _id: string;
  TXN: string;
  company_email: string;
  product_name: string;
  category: string;
  material: string;
  size: string;
  batch_no: string;
  manufacture_date: string;
  rfid: string;
  created_at: string;
  price?: number;
  added_at?: string;
  currentStatus?: string;
};

type RewardCalculation = {
  material: string;
  price: number;
  days_difference: number;
  reward_points: number;
};

type Stats = {
  registeredProducts: number;
  collected: number;
  pendingPickup: number;
  totalRewards: number;
};

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [calculatedReward, setCalculatedReward] = useState<RewardCalculation | null>(null);
  const [isCalculatingReward, setIsCalculatingReward] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  
  const userEmail = getUserEmail();
  const userRole = getUserRole();

  // Fetch all products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["all_products", userEmail],
    queryFn: async () => {
      if (!userEmail) throw new Error("User email not found");
      return await api.getProductsByEmail(userEmail);
    },
    enabled: !!userEmail,
  });

  const products: Product[] = productsData?.products || [];

  // Separate products by status
  const activeProducts = products.filter(p => 
    !p.currentStatus || p.currentStatus === "Registered" || p.currentStatus === "Active"
  );
  
  const pendingPickupProducts = products.filter(p => 
    p.currentStatus === "Pending Pickup"
  );
  
  const collectedProducts = products.filter(p => 
    p.currentStatus === "Collected" || p.currentStatus === "Processing" || p.currentStatus === "Recycled"
  );

  // Calculate rewards: only from collected products (completed recycling)
  const earnedRewards = collectedProducts.reduce((sum, product) => {
    return sum + (product.price ? product.price * 0.12 : 0);
  }, 0);

  // Calculate pending rewards: from active and pending pickup products
  const pendingRewards = [...activeProducts, ...pendingPickupProducts].reduce((sum, product) => {
    return sum + (product.price ? product.price * 0.12 : 0);
  }, 0);

  const stats: Stats = {
    registeredProducts: activeProducts.length,
    collected: collectedProducts.length,
    pendingPickup: pendingPickupProducts.length,
    totalRewards: Math.round(earnedRewards * 100) / 100,
  };

  // Calculate reward mutation
  const calculateRewardMutation = useMutation({
    mutationFn: async (data: {
      material: string;
      price: number;
      manufacture_date: string;
      added_date: string;
    }) => {
      return await api.calculateReward(data);
    },
    onSuccess: (data: RewardCalculation) => {
      setCalculatedReward(data);
      toast({
        title: "Reward Calculated!",
        description: `You'll earn ₹${data.reward_points.toFixed(2)} when this product is collected!`,
        duration: 5000,
      });
    },
    onError: () => {
      setCalculatedReward(null);
    },
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productRfid: string) => {
      if (!userEmail) throw new Error("User email not found");
      const result = await api.addProduct({
        email: userEmail,
        added_at: new Date().toISOString(),
        product_rfid: productRfid,
      });
      if (result.status !== "success") {
        throw new Error(result.detail || result.message || "Failed to add product");
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: calculatedReward 
          ? `Product added! You'll earn ₹${calculatedReward.reward_points.toFixed(2)} when collected!`
          : "Product added to your account successfully!",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["all_products", userEmail] });
      setShowProductDetails(false);
      setScannedProduct(null);
      setCalculatedReward(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const handleScanComplete = async (code: string) => {
    try {
      const data = await api.getProductByRfid(code);
      
      if (data.status === "success" && data.product) {
        setScannedProduct(data.product);
        setShowProductDetails(true);
        setCalculatedReward(null);
        
        toast({
          title: "Product Found",
          description: `${data.product.product_name} - ${data.product.rfid}`,
        });

        if (data.product.price) {
          setIsCalculatingReward(true);
          calculateRewardMutation.mutate({
            material: data.product.material,
            price: parseFloat(data.product.price),
            manufacture_date: data.product.manufacture_date,
            added_date: new Date().toISOString(),
          });
          setIsCalculatingReward(false);
        }
      } else {
        toast({
          title: "Product Not Found",
          description: `No product found with RFID: ${code}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan product",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    if (scannedProduct && userEmail) {
      if (!scannedProduct.TXN) {
        toast({
          title: "Error",
          description: "Product transaction ID not found",
          variant: "destructive",
        });
        return;
      }
      
      addProductMutation.mutate(scannedProduct.rfid);
    } else if (!userEmail) {
      toast({
        title: "Error",
        description: "Please login to add products",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Pending Pickup":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending Pickup
          </Badge>
        );
      case "Collected":
        return (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300">
            <Truck className="w-3 h-3 mr-1" />
            Collected
          </Badge>
        );
      case "Processing":
        return (
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "Recycled":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Recycled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Package className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Customer Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Register products for recycling and track your rewards
        </p>
        {userEmail && (
          <p className="text-xs text-muted-foreground mt-1">
            Logged in as: {userEmail}
          </p>
        )}
      </div>

      {/* Scanner and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScannerInterface onScanComplete={handleScanComplete} />
        </div>

        <div className="space-y-4">
          <Card className="overflow-visible">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <RequestPickupDialog 
                trigger={
                  <Button className="w-full" variant="outline" data-testid="button-request-pickup">
                    <Truck className="w-4 h-4 mr-2" />
                    Request Pickup
                  </Button>
                }
              />
              <Button className="w-full" variant="outline" data-testid="button-find-dropoff">
                <MapPin className="w-4 h-4 mr-2" />
                Find Drop-off Point
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setActiveTab("pickups")}
                data-testid="button-view-pickups"
              >
                <Truck className="w-4 h-4 mr-2" />
                View My Pickups
                {pendingPickupProducts.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-500/20 text-yellow-700">
                    {pendingPickupProducts.length}
                  </Badge>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-visible bg-gradient-to-br from-green-600 to-green-500 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                Earned Rewards
              </CardTitle>
              <CardDescription className="text-white/80">
                From collected products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2" data-testid="text-total-rewards">
                ₹{stats.totalRewards.toFixed(2)}
              </div>
              <p className="text-sm text-white/80 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                1 point = ₹1
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scanned Product Details */}
      {showProductDetails && scannedProduct && (
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Scanned Product Details
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowProductDetails(false);
                  setScannedProduct(null);
                  setCalculatedReward(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculatedReward && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Estimated Reward</div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ₹{calculatedReward.reward_points.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Earn when product is collected • 1 point = ₹1
                      </div>
                    </div>
                    <Award className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>
            )}

            {calculateRewardMutation.isPending && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="pt-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Calculating your reward...</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Product Name</div>
                <div className="font-semibold">{scannedProduct.product_name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">RFID</div>
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {scannedProduct.rfid}
                </code>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Category</div>
                <div className="capitalize">{scannedProduct.category}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Material</div>
                <div className="capitalize">{scannedProduct.material}</div>
              </div>
              {scannedProduct.size && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Size</div>
                  <div className="uppercase">{scannedProduct.size}</div>
                </div>
              )}
              {scannedProduct.batch_no && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Batch No</div>
                  <code className="text-sm font-mono">{scannedProduct.batch_no}</code>
                </div>
              )}
              {scannedProduct.price && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Price</div>
                  <div className="font-semibold">${parseFloat(scannedProduct.price.toString()).toFixed(2)}</div>
                </div>
              )}
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Manufacture Date</div>
                <div>
                  {new Date(scannedProduct.manufacture_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Company</div>
                <div className="text-sm">{scannedProduct.company_email}</div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddProduct} 
                className="flex-1"
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {calculatedReward ? `Add & Earn ₹${calculatedReward.reward_points.toFixed(2)}` : 'Add to My Products'}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation(`/product/${scannedProduct.rfid}`)}
              >
                View Full Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Registered Products"
          value={stats.registeredProducts.toString()}
          icon={Scan}
        />
        <StatsCard
          title="Collected"
          value={stats.collected.toString()}
          icon={Recycle}
        />
        <StatsCard
          title="Pending Pickup"
          value={stats.pendingPickup.toString()}
          icon={Truck}
        />
        <Card className="overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingRewards.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From active & pickup products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Products and Pickups */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            My Products
            {activeProducts.length > 0 && (
              <Badge variant="secondary" className="ml-1">{activeProducts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pickups" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Pending Pickups
            {pendingPickupProducts.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                {pendingPickupProducts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Recycle className="w-4 h-4" />
            Collection History
            {collectedProducts.length > 0 && (
              <Badge variant="secondary" className="ml-1">{collectedProducts.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* My Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Registered Products</h2>
            {activeProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {activeProducts.length} product{activeProducts.length !== 1 ? 's' : ''} ready for pickup
              </p>
            )}
          </div>
          
          {activeProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  No active products. Scan a product to get started.
                </p>
                <p className="text-sm text-muted-foreground">
                  Earn reward points for every product you register for recycling!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProducts.map((product) => (
                <Card key={product._id} className="overflow-visible hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{product.product_name}</h3>
                        <code className="text-xs text-muted-foreground font-mono block truncate">
                          {product.rfid}
                        </code>
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(product.currentStatus)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="capitalize">
                        {product.material}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                    
                    {product.batch_no && (
                      <p className="text-xs text-muted-foreground">
                        Batch: {product.batch_no}
                      </p>
                    )}
                    
                    {product.price && (
                      <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        Pending: ~₹{(parseFloat(product.price.toString()) * 0.12).toFixed(2)}
                      </p>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setLocation(`/product/${product.rfid}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Pickups Tab */}
        <TabsContent value="pickups" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pending Pickups</h2>
            {pendingPickupProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {pendingPickupProducts.length} product{pendingPickupProducts.length !== 1 ? 's' : ''} awaiting pickup
              </p>
            )}
          </div>
          
          {pendingPickupProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  No pending pickups at the moment.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Request a pickup for your registered products to start the recycling process!
                </p>
                <RequestPickupDialog 
                  trigger={
                    <Button variant="outline">
                      <Truck className="w-4 h-4 mr-2" />
                      Request Pickup
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                        Pickup Requests in Progress
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Your products are scheduled for pickup. Our team will collect them soon!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingPickupProducts.map((product) => (
                  <Card key={product._id} className="overflow-visible hover:shadow-md transition-shadow border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{product.product_name}</h3>
                          <code className="text-xs text-muted-foreground font-mono block truncate">
                            {product.rfid}
                          </code>
                        </div>
                        <div className="ml-2">
                          {getStatusBadge(product.currentStatus)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="capitalize">
                          {product.material}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                      </div>
                      
                      {product.batch_no && (
                        <p className="text-xs text-muted-foreground">
                          Batch: {product.batch_no}
                        </p>
                      )}
                      
                      {product.added_at && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Requested: {new Date(product.added_at).toLocaleDateString()}
                        </p>
                      )}
                      
                      {product.price && (
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                          Pending: ~₹{(parseFloat(product.price.toString()) * 0.12).toFixed(2)}
                        </p>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setLocation(`/product/${product.rfid}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Collection History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Collection History</h2>
            {collectedProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {collectedProducts.length} product{collectedProducts.length !== 1 ? 's' : ''} collected
              </p>
            )}
          </div>
          
          {collectedProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Recycle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  No collection history yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Once your products are collected, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectedProducts.map((product) => (
                <Card key={product._id} className="overflow-visible hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{product.product_name}</h3>
                        <code className="text-xs text-muted-foreground font-mono block truncate">
                          {product.rfid}
                        </code>
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(product.currentStatus)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="capitalize">
                        {product.material}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                    
                    {product.batch_no && (
                      <p className="text-xs text-muted-foreground">
                        Batch: {product.batch_no}
                      </p>
                    )}
                    
                    {product.added_at && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Collected: {new Date(product.added_at).toLocaleDateString()}
                      </p>
                    )}
                    
                    {product.price && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Earned: ₹{(parseFloat(product.price.toString()) * 0.12).toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setLocation(`/product/${product.rfid}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}