import { useFormik, FormikConfig, FormikValues } from "formik";
import * as Yup from "yup";

const useCustomFormik = <T>(config: FormikConfig<T>) => {
  return useFormik({
    ...(config as unknown as FormikConfig<FormikValues>),
    validationSchema: config.validationSchema || Yup.object({}),
  });
};

export default useCustomFormik;