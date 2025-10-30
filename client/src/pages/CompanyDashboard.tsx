import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatsCard } from "@/components/StatsCard";
import { ProductCard } from "@/components/ProductCard";
import { BulkUploadDialog } from "@/components/BulkUploadDialog";
import { AddProductDialog } from "@/components/AddProductDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Recycle, TrendingUp, Loader2, Search, Filter, LayoutGrid, List } from "lucide-react";
import { useLocation } from "wouter";
import { getUserEmail, getUserRole } from './LoginPage';

type Product = {
  _id?: string;
  product_name: string;
  category: string;
  material: string;
  size: string;
  batch_no: string;
  manufacture_date: string;
  company_email: string;
  rfid: string;
  created_at: string;
  price?: string;
  currentStatus?: string;
};

type Stats = {
  totalProducts: number;
  activeProducts: number;
  inMarket: number;
  collected: number;
};

export default function CompanyDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");
  
  const email = getUserEmail();
  const role = getUserRole();

  // Fetch products for this company
  const { data, isLoading: productsLoading, error, refetch } = useQuery({
    queryKey: ["products_by_company", email],
    queryFn: async () => {
      if (!email) throw new Error("Company email not found");
      return await api.getProductsByCompany(email);
    },
    enabled: !!email,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const products: Product[] = data?.products || [];

  // Separate products by status
  const activeProducts = products.filter(p => 
    !p.currentStatus || p.currentStatus === "Registered" || p.currentStatus === "Active"
  );
  
  const inMarketProducts = products.filter(p => 
    p.currentStatus === "Pending Pickup" || p.currentStatus === "Collected"
  );
  
  const collectedProducts = products.filter(p => 
    p.currentStatus === "Processing" || p.currentStatus === "Recycled"
  );

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.rfid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats: Stats = {
    totalProducts: products.length,
    activeProducts: activeProducts.length,
    inMarket: inMarketProducts.length,
    collected: collectedProducts.length,
  };

  const getStatusBadge = (status?: string) => {
    const statusColors: Record<string, string> = {
      "Registered": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300",
      "Active": "bg-green-500/10 text-green-700 dark:text-green-400 border-green-300",
      "Pending Pickup": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-300",
      "Collected": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300",
      "Processing": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-300",
      "Recycled": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300",
    };

    return (
      <Badge variant="secondary" className={statusColors[status || "Active"] || "bg-gray-500/10"}>
        {status || "Active"}
      </Badge>
    );
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive gap-4">
        <p>Error loading products. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and track their lifecycle
          </p>
          {email && (
            <p className="text-xs text-muted-foreground mt-1">
              Logged in as: {email}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <AddProductDialog />
          <BulkUploadDialog />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={Package}
        />
        <StatsCard
          title="Active Products"
          value={stats.activeProducts.toString()}
          icon={TrendingUp}
        />
        <StatsCard
          title="In Market"
          value={stats.inMarket.toString()}
          icon={Package}
        />
        <StatsCard
          title="Collected/Recycled"
          value={stats.collected.toString()}
          icon={Recycle}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="all-products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            All Products
            {products.length > 0 && (
              <Badge variant="secondary" className="ml-1">{products.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Active
            {activeProducts.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-green-500/20 text-green-700">
                {activeProducts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="flex items-center gap-2">
            <Recycle className="w-4 h-4" />
            In Lifecycle
            {(inMarketProducts.length + collectedProducts.length) > 0 && (
              <Badge variant="secondary" className="ml-1">
                {inMarketProducts.length + collectedProducts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No products yet. Add your first product to get started.
                    </p>
                    <AddProductDialog
                      trigger={
                        <Button>
                          <Package className="w-4 h-4 mr-2" />
                          Add Your First Product
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product) => (
                      <div 
                        key={product.rfid}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setLocation(`/product/${product.rfid}`)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{product.product_name}</div>
                          <code className="text-xs text-muted-foreground">{product.rfid}</code>
                        </div>
                        <div className="ml-3">
                          {getStatusBadge(product.currentStatus)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AddProductDialog
                  trigger={
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Add Single Product
                    </Button>
                  }
                />
                <BulkUploadDialog
                  trigger={
                    <Button variant="outline" className="w-full justify-start">
                      <Recycle className="w-4 h-4 mr-2" />
                      Bulk Upload Products
                    </Button>
                  }
                />
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("all-products")}
                >
                  <List className="w-4 h-4 mr-2" />
                  View All Products
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Products Tab */}
        <TabsContent value="all-products" className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, RFID, category, or material..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No products match your search." : "No products yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-3"
            }>
              {filteredProducts.map((product) => (
                viewMode === "grid" ? (
                  <ProductCard
                    key={product.rfid}
                    productCode={product.rfid}
                    name={product.product_name}
                    category={product.category}
                    material={product.material}
                    status={product.currentStatus || "Active"}
                    onViewDetails={() => setLocation(`/product/${product.rfid}`)}
                  />
                ) : (
                  <Card 
                    key={product.rfid}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/product/${product.rfid}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{product.product_name}</div>
                            <div className="text-sm text-muted-foreground">
                              <code className="text-xs">{product.rfid}</code> • {product.category} • {product.material}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {product.price && (
                            <div className="text-right">
                              <div className="text-sm font-semibold">${parseFloat(product.price).toFixed(2)}</div>
                            </div>
                          )}
                          {getStatusBadge(product.currentStatus)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          )}
        </TabsContent>

        {/* Active Products Tab */}
        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Products</h2>
            {activeProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {activeProducts.length} product{activeProducts.length !== 1 ? 's' : ''} in stock
              </p>
            )}
          </div>

          {activeProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  No active products.
                </p>
                <p className="text-sm text-muted-foreground">
                  Active products are registered and ready for distribution.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProducts.map((product) => (
                <ProductCard
                  key={product.rfid}
                  productCode={product.rfid}
                  name={product.product_name}
                  category={product.category}
                  material={product.material}
                  status={product.currentStatus || "Active"}
                  onViewDetails={() => setLocation(`/product/${product.rfid}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Lifecycle Tab */}
        <TabsContent value="lifecycle" className="space-y-4">
          <div className="space-y-6">
            {/* In Market Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">In Market / Customer Hands</h2>
                {inMarketProducts.length > 0 && (
                  <Badge variant="secondary">{inMarketProducts.length}</Badge>
                )}
              </div>

              {inMarketProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No products currently in market
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inMarketProducts.map((product) => (
                    <ProductCard
                      key={product.rfid}
                      productCode={product.rfid}
                      name={product.product_name}
                      category={product.category}
                      material={product.material}
                      status={product.currentStatus || "Active"}
                      onViewDetails={() => setLocation(`/product/${product.rfid}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Collected/Recycled Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Collected & Recycled</h2>
                {collectedProducts.length > 0 && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                    {collectedProducts.length}
                  </Badge>
                )}
              </div>

              {collectedProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Recycle className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No products collected for recycling yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collectedProducts.map((product) => (
                    <ProductCard
                      key={product.rfid}
                      productCode={product.rfid}
                      name={product.product_name}
                      category={product.category}
                      material={product.material}
                      status={product.currentStatus || "Active"}
                      onViewDetails={() => setLocation(`/product/${product.rfid}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}