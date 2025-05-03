import React from "react";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type StoreFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any, helpers: any) => void;
  initialValues: {
    name: string;
    address: string;
    email: string;
    image: string;
  };
  mode: "add" | "edit";
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Store name is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  image: Yup.string().url("Invalid image URL").required("Image URL is required"),
});

const StoreForm: React.FC<StoreFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded max-w-md w-full shadow-xl">
          <Dialog.Title className="text-lg font-bold mb-4">
            {mode === "add" ? "Add New Store" : "Edit Store"}
          </Dialog.Title>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            <Form className="space-y-4">
              <div>
                <label className="block font-medium">Store Name</label>
                <Field type="text" name="name" className="w-full border border-gray-300 rounded p-2" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Address</label>
                <Field type="text" name="address" className="w-full border border-gray-300 rounded p-2" />
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Email</label>
                <Field type="email" name="email" className="w-full border border-gray-300 rounded p-2" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block font-medium">Image URL</label>
                <Field type="text" name="image" className="w-full border border-gray-300 rounded p-2" />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                  {mode === "add" ? "Save Store" : "Update Store"}
                </button>
              </div>
            </Form>
          </Formik>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StoreForm;
