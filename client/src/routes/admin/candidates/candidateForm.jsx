import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CandidateForm = ({ candidateId, onCandidateUpdated }) => {
    const [parties, setParties] = useState([]);
    const [imagePreview, setImagePreview] = useState('');

    // Fetch parties
    useEffect(() => {
        const fetchParties = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api-admin/get-all-parties'); // Update with your actual endpoint
                if (Array.isArray(response.data)) {
                    setParties(response.data);
                } else {
                    console.error('Unexpected data structure:', response.data);
                    setParties([]);
                }
            } catch (error) {
                console.error('Error fetching parties:', error);
            }
        };

        fetchParties();
    }, []);

    // Validation schema with Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        image: Yup.mixed().required('Image is required'),
        parties: Yup.array().of(Yup.string()).required('At least one party must be selected'),
    });

    // Initial form values
    const initialValues = {
        name: '',
        image: null,
        parties: [],
    };

    // Fetch candidate details if editing
    useEffect(() => {
        if (candidateId) {
            const fetchCandidate = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api-admin/get-candidate-byId/${candidateId}`);
                    const { name, image, parties } = response.data;
                    initialValues.name = name;
                    initialValues.image = image; // This won't be used since we'll upload the image file
                    initialValues.parties = parties.map(party => party._id);
                    setImagePreview(image); // Set the image preview for editing
                } catch (error) {
                    console.error('Error fetching candidate:', error);
                }
            };

            fetchCandidate();
        }
    }, [candidateId]);

    // Handle form submission
    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('image', values.image); // Append the image file
        formData.append('parties', JSON.stringify(values.parties)); // Convert parties to a JSON string

        try {
            if (candidateId) {
                await axios.put(`http://localhost:8080/api-admin/update-candidate-byId/${candidateId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post('/api-admin/add-candidate', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            onCandidateUpdated();
            resetForm(); // Reset the form after submission
            setImagePreview(''); // Clear image preview
        } catch (error) {
            console.error('Error saving candidate:', error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue }) => (
                <Form className="space-y-4">
                    <div>
                        <label className="block font-medium">Name:</label>
                        <Field
                            type="text"
                            name="name"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-600" />
                    </div>
                    <div>
                        <label className="block font-medium">Image:</label>
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer"
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue("image", file); // Set the file in Formik state
                                    if (file) {
                                        setImagePreview(URL.createObjectURL(file)); // Create a URL for image preview
                                    }
                                }}
                                className="hidden" // Hide the default file input
                            />
                            <p className="text-gray-500">Drag and drop an image here or click to upload</p>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Image Preview"
                                    className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-300"
                                />
                            )}
                        </div>
                        <ErrorMessage name="image" component="div" className="text-red-600" />
                    </div>
                    <div>
                        <label className="block font-medium">Parties:</label>
                        {parties.length === 0 ? (
                            <p className="text-gray-500">No parties available. Please add a party first.</p>
                        ) : (
                            <Field as="select" name="parties" multiple className="border border-gray-300 rounded px-3 py-2 w-full">
                                {parties.map((party) => (
                                    <option key={party._id} value={party._id}>
                                        {party.name}
                                    </option>
                                ))}
                            </Field>
                        )}
                        <ErrorMessage name="parties" component="div" className="text-red-600" />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        {candidateId ? 'Update' : 'Create'} Candidate
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default CandidateForm;
