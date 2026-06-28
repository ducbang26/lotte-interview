import * as yup from "yup";

export const documentSchema = yup.object().shape({
  code: yup.string().required("Code is required"),
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Status is required"),
  createdBy: yup.string().required("Created By is required"),
});
