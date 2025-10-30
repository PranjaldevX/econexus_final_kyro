import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { getUserEmail, getUserRole } from '@/pages/LoginPage';

interface AddProductDialogProps {
  trigger?: React.ReactNode;
}

export function AddProductDialog({ trigger }: AddProductDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Get logged-in company email
  const userEmail = getUserEmail();
  const userRole = getUserRole();

  const [formData, setFormData] = useState({
    company_email: "",
    product_name: "",
    category: "",
    material: "",
    size: "",
    batch_no: "",
    manufacture_date: new Date().toISOString().split("T")[0],
    price: "",
  });

  // Set company email from logged-in user when component mounts or dialog opens
  useEffect(() => {
    if (open && userRole === "company" && userEmail) {
      setFormData(prev => ({
        ...prev,
        company_email: userEmail
      }));
    }
  }, [open, userEmail, userRole]);

  const createProductMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const result = await api.addProductCompany(data);
      if (result.status !== "success") {
        throw new Error(result.detail || result.message || "Failed to create product");
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      // Invalidate and refetch products query for this company
      queryClient.invalidateQueries({ queryKey: ['products_by_company', userEmail] });
      
      setOpen(false);
      // Reset form but keep company email
      setFormData({
        company_email: userEmail || "",
        product_name: "",
        category: "",
        material: "",
        size: "",
        batch_no: "",
        manufacture_date: new Date().toISOString().split("T")[0],
        price: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that user is logged in as company
    if (userRole !== "company") {
      toast({
        title: "Error",
        description: "Only companies can add products",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail) {
      toast({
        title: "Error",
        description: "Company email not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    createProductMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Register a new product in the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyEmail">Company Email *</Label>
            <Input
              id="companyEmail"
              type="email"
              value={formData.company_email}
              onChange={(e) =>
                setFormData({ ...formData, company_email: e.target.value })
              }
              disabled={true}
              className="bg-muted cursor-not-allowed"
              required
            />
            <p className="text-xs text-muted-foreground">
              This email is automatically set from your logged-in account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData.product_name}
              onChange={(e) =>
                setFormData({ ...formData, product_name: e.target.value })
              }
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g., Electronics, Clothing, Food"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Material *</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
              placeholder="e.g., Plastic, Cotton, Metal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                placeholder="e.g., M, L, XL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchNo">Batch No</Label>
              <Input
                id="batchNo"
                value={formData.batch_no}
                onChange={(e) =>
                  setFormData({ ...formData, batch_no: e.target.value })
                }
                placeholder="e.g., BATCH001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufactureDate">Manufacture Date *</Label>
              <Input
                id="manufactureDate"
                type="date"
                value={formData.manufacture_date}
                onChange={(e) =>
                  setFormData({ ...formData, manufacture_date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createProductMutation.isPending || !userEmail}
          >
            {createProductMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}