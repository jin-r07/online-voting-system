import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Users() {
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editUserId, setEditUserId] = useState(null);

  const [picturePreview, setPicturePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      voterIdCardPicture: null,
      voterIdCardNumber: "",
      role: "user"
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      voterIdCardPicture: Yup.mixed()
        .notRequired()
        .test("fileType", "Only .jpg and .png files are allowed", (value) => {
          return !value || (value && (value.type === "image/jpeg" || value.type === "image/png"));
        }),
      voterIdCardNumber: Yup.string().required("Voter ID Card Number is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("email", values.email);
      if (values.voterIdCardPicture) {
        formData.append("voterIdCardPicture", values.voterIdCardPicture);
      }
      formData.append("voterIdCardNumber", values.voterIdCardNumber);
      formData.append("role", values.role);

      try {
        if (editUserId) {
          await axios.put(`http://localhost:8080/api-admin/edit-user/${editUserId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          toast.success("User updated successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error("Error processing request", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        fetchUsers();
        setIsModalOpen(false);
        formik.resetForm();
        setEditUserId(null);
        setPicturePreview(null);
      } catch (err) {
        toast.error("Error processing request", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api-admin/get-all-users");
      setUsers(response.data);
    } catch (err) {
      toast.error("Error fetching users", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api-admin/delete-user/${id}`);
      toast.success("User deleted successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchUsers();
    } catch (err) {
      toast.error("Error deleting user", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user._id);
    formik.setValues({
      email: user.email,
      voterIdCardNumber: user.voterIdCardNumber,
      role: user.role,
    });
    setPicturePreview(user.voterIdCardPicture);
    setIsModalOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("voterIdCardPicture", file);
    setPicturePreview(URL.createObjectURL(file));
  };

  return (
    <div className="pl-80 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Users</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Add User
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-10 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editUserId ? 'Edit User' : 'Create User'}</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`mt-1 block w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                  placeholder="Enter email"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <label htmlFor="voterIdCardNumber" className="block text-sm font-medium text-gray-700">Voter ID Card Number</label>
                <input
                  id="voterIdCardNumber"
                  name="voterIdCardNumber"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.voterIdCardNumber}
                  className={`mt-1 block w-full border ${formik.touched.voterIdCardNumber && formik.errors.voterIdCardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                  placeholder="Enter voter ID card number"
                />
                {formik.touched.voterIdCardNumber && formik.errors.voterIdCardNumber && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.voterIdCardNumber}</div>
                )}
              </div>

              <div>
                <div className="my-6 flex justify-center">
                  {picturePreview && (
                    <img src={picturePreview} alt="Voter ID Preview" className="h-auto w-52 object-cover rounded-md" />
                  )}
                </div>
                <label htmlFor="voterIdCardPicture" className="block text-sm font-medium text-gray-700">Upload Voter ID Card Picture</label>
                <input
                  id="voterIdCardPicture"
                  name="voterIdCardPicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                  className={`mt-1 block w-full border ${formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    formik.resetForm();
                    setEditUserId(null);
                    setPicturePreview(null);
                  }}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {editUserId ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mt-10 text-gray-800">Existing Users</h3>
      <ul className="mt-4 space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="flex items-center border rounded-md p-4 bg-gray-50">
              <div className="flex">
                <div className="mr-8">
                  {user.voterIdCardPicture && (
                    <img src={user.voterIdCardPicture} alt="Voter ID" className="mt-2 h-auto w-24 object-cover rounded-md" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-900">{user.email}</span>
                  <span className="text-sm text-gray-600">Voter ID: {user.voterIdCardNumber}</span>
                  <span className="text-sm text-gray-600">Role: {user.role}</span>
                </div>
              </div>
              <div className="ml-auto flex space-x-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No users available.</li>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
}
