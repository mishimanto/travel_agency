import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChevronLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CreatePackage({ destinations }) {
  const { data, setData, post, errors, processing } = useForm({
    title: '',
    description: '',
    price: '',
    offer_price: '',
    duration_days: '',
    destination_id: '',
    image: null,
    available_dates: [''],
    inclusions: [''],
    itinerary: [{ day: '1', title: '', description: '' }],
    is_featured: false,
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'itinerary' || key === 'available_dates' || key === 'inclusions') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === 'image' && data[key]) {
        formData.append(key, data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    post(route('admin.packages.store'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => router.visit(route('admin.packages.index')),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData('image', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const addAvailableDate = () => {
    setData('available_dates', [...data.available_dates, '']);
  };

  const updateAvailableDate = (index, value) => {
    const newDates = [...data.available_dates];
    newDates[index] = value;
    setData('available_dates', newDates);
  };

  const removeAvailableDate = (index) => {
    const newDates = data.available_dates.filter((_, i) => i !== index);
    setData('available_dates', newDates);
  };

  const addInclusion = () => {
    setData('inclusions', [...data.inclusions, '']);
  };

  const updateInclusion = (index, value) => {
    const newInclusions = [...data.inclusions];
    newInclusions[index] = value;
    setData('inclusions', newInclusions);
  };

  const removeInclusion = (index) => {
    const newInclusions = data.inclusions.filter((_, i) => i !== index);
    setData('inclusions', newInclusions);
  };

  const addItineraryDay = () => {
    const newDay = data.itinerary.length + 1;
    setData('itinerary', [...data.itinerary, { day: newDay.toString(), title: '', description: '' }]);
  };

  const updateItinerary = (index, field, value) => {
    const newItinerary = [...data.itinerary];
    newItinerary[index][field] = value;
    setData('itinerary', newItinerary);
  };

  const removeItineraryDay = (index) => {
    const newItinerary = data.itinerary.filter((_, i) => i !== index);
    // Renumber days
    newItinerary.forEach((day, idx) => {
      day.day = (idx + 1).toString();
    });
    setData('itinerary', newItinerary);
  };

  return (
    <AdminLayout>
      <Head title="Create Package" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center mb-6">
                <Link
                  href={route('admin.packages.index')}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Link>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Create New Package</h2>
                  <p className="text-gray-600 mt-1">Fill in the details for the new travel package</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Bali Beach Paradise Getaway"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination *
                    </label>
                    <select
                      value={data.destination_id}
                      onChange={(e) => setData('destination_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                    {errors.destination_id && <p className="mt-1 text-sm text-red-600">{errors.destination_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={data.price}
                      onChange={(e) => setData('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1599.99"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={data.duration_days}
                      onChange={(e) => setData('duration_days', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="5"
                    />
                    {errors.duration_days && <p className="mt-1 text-sm text-red-600">{errors.duration_days}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the package..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="mr-4">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-48 object-cover rounded"
                        />
                      ) : (
                        <div className="h-32 w-48 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <span className="text-gray-400">No image selected</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                </div>

                {/* Available Dates */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Dates
                    </label>
                    <button
                      type="button"
                      onClick={addAvailableDate}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <PlusIcon className="h-4 w-4 inline mr-1" />
                      Add Date
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.available_dates.map((date, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => updateAvailableDate(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {data.available_dates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAvailableDate(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Inclusions (What's included)
                    </label>
                    <button
                      type="button"
                      onClick={addInclusion}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <PlusIcon className="h-4 w-4 inline mr-1" />
                      Add Inclusion
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={inclusion}
                          onChange={(e) => updateInclusion(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Luxury accommodation, Breakfast, etc."
                        />
                        {data.inclusions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInclusion(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-medium text-gray-700">
                      Itinerary
                    </label>
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Day
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {data.itinerary.map((day, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">Day {day.day}</h4>
                          {data.itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItineraryDay(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Arrival in Bali"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={day.description}
                              onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                              rows="2"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Describe the day's activities..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <input
                        id="is_featured"
                        type="checkbox"
                        checked={data.is_featured}
                        onChange={(e) => setData('is_featured', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                        Mark as Featured Package
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="is_active"
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Active (Visible to users)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Link
                    href={route('admin.packages.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {processing ? 'Creating...' : 'Create Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}