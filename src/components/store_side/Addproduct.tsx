import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Store_add_Product, Store_get_allCategories } from "../../reducers/autopartsstore/autopartsStoreapicalls";
import { CategoryStateTypes, ToastMsg } from "../../types/admin/admintypes";
import { FaTrash } from "react-icons/fa";
import { Store_Product_types } from "../../types/storetypes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ToastAlert from "../alert/ToastAlert";
import { ErrorPayload } from "../../types/clients/UsersTypes";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDNARY_URL;
const UPLOAD_PRESET = "Product_images";

const AddProduct = () => {
    const dispatch: AppDispatch = useDispatch();
    const [categories, setCategories] = useState<CategoryStateTypes[]>([]);
    const [images, setImages] = useState<File[]>([]);
    // const [imageUrls, setImageUrls] = useState<string[]>([]);
    const navigate = useNavigate();
const {store}=useSelector((state:RootState)=>state.store)
    const [formData, setFormData] = useState<{name:string,description:string,price:string,category:string,quantity:string}>({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showMsg, setShowMsg] = useState<ToastMsg>({
        action: false,
        message: "",
        type: "idle",
    });

    // Fetch categories on mount
    useEffect(() => {
        dispatch(Store_get_allCategories())
            .unwrap()
            .then((res) => setCategories(res))
            .catch((err) => console.error("Error fetching categories", err));
    }, [dispatch]);

    // Handle Input Change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Image Upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedImages = Array.from(e.target.files);
            setImages([...images, ...selectedImages]);
        }
    };

    // Remove Image
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Validate Form
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
            newErrors.price = "Valid price is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0)
            newErrors.quantity = "Valid quantity is required";
        if (images.length === 0) newErrors.images = "At least one image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Upload Images to Cloudinary
    const uploadImages = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];

        for (const file of images) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            try {
                const response = await axios.post(CLOUDINARY_URL, formData);
                uploadedUrls.push(response.data.secure_url);
            } catch (error) {
                console.error("Error uploading image:", error);
                setShowMsg({ action: true, message: "Image upload failed", type: "error" });
            }
        }

        return uploadedUrls;
    };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Upload images to Cloudinary
        const uploadedUrls = await uploadImages();
        if (uploadedUrls.length === 0) {
            alert("Image upload failed.");
            return;
        }

        // Prepare product data
        const product: Store_Product_types = {
            id: "",
            ...formData,
            category:categories.find((item)=>item.id==formData.category)as CategoryStateTypes,
            price: Number(formData.price),
            storeId:store?.id||"",
            stock: Number(formData.quantity),
            images: uploadedUrls,
            
        };

        // Dispatch to Redux
        dispatch(Store_add_Product(product))
            .unwrap()
            .then(() => {
                setShowMsg({ action: true, message: "Product added successfully!", type: "success" });
                setTimeout(() => navigate("/store/products"), 1000);
            })
            .catch((error:ErrorPayload) => {
                setShowMsg({ action: true, message: error.message, type: "error" });
            });
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

            {showMsg.action && <ToastAlert onClose={()=>setShowMsg((prev)=>({...prev,action:false}))}  message={showMsg.message} type={showMsg.type as "success"|"error"|"info"} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Product Name" className="w-full p-3 border rounded-md"
                    value={formData.name} onChange={handleInputChange} />
                {errors.name && <p className="text-red-500">{errors.name}</p>}

                <textarea name="description" placeholder="Product Description" className="w-full p-3 border rounded-md"
                    value={formData.description} onChange={handleInputChange} />
                {errors.description && <p className="text-red-500">{errors.description}</p>}

                <input type="number" name="price" placeholder="Price" className="w-full p-3 border rounded-md"
                    value={formData.price} onChange={handleInputChange} />
                {errors.price && <p className="text-red-500">{errors.price}</p>}

                <select name="category" className="w-full p-3 border rounded-md" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {errors.category && <p className="text-red-500">{errors.category}</p>}

                <input type="number" name="quantity" placeholder="Quantity" className="w-full p-3 border rounded-md"
                    value={formData.quantity} onChange={handleInputChange} />
                {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}

                {/* Image Upload */}
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full p-3 border rounded-md" />
                {errors.images && <p className="text-red-500">{errors.images}</p>}

                {/* Image Preview */}
                <div className="flex flex-wrap mt-2">
                    {images.map((file, index) => (
                        <div key={index} className="relative">
                            <img src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                            <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
