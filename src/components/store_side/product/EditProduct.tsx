import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Store_update_Product, Store_get_Product, Store_get_allCategories } from "../../../reducers/autopartsstore/autopartsStoreapicalls";
import { Store_Product_types,  } from "../../../types/storetypes";
import axios from "axios";
import { FaTrash, FaUpload } from "react-icons/fa";

const CLOUDINARY_URL =import.meta.env.VITE_CLOUDNARY_URL;
const UPLOAD_PRESET = "Product_images";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const {categories  } = useSelector((state: RootState) => state.admin);
  const [product, setProduct] = useState<Store_Product_types | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    dispatch(Store_get_allCategories());
    dispatch(Store_get_Product(id||""))
      .unwrap()
      .then((data) => {
        setProduct(data);
        setImageUrls(data.images);
      });
  }, [dispatch, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProduct((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      setImages([...images, ...selectedImages]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
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
      }
    }

    setImageUrls([...imageUrls, ...uploadedUrls]);
    setImages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const updatedProduct:Store_Product_types = {
      ...product,
      images: imageUrls,
    };

    dispatch(Store_update_Product( updatedProduct ))
      .unwrap()
      .then(() => navigate("/store/products"))
      .catch((err) => console.error("Update failed", err));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={typeof product.category.id === "string" ? product.category.id : product.category.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700">Images</label>
          <input type="file" multiple onChange={handleImageChange} className="mb-2" />
          <button
            type="button"
            onClick={uploadImages}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded"
          >
            <FaUpload /> Upload Images
          </button>

          {/* Image Preview */}
          <div className="flex flex-wrap gap-2 mt-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="Product" className="w-24 h-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
