import { useField } from "formik";
import {
  AsyncSelect as ChakraAsyncSelect,
  chakraComponents,
} from "chakra-react-select";

export const AsyncSelect = ({
  name,
  loadOptions,
  components = chakraComponents,
  ...props
}) => {
  const [field, , helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <ChakraAsyncSelect
      {...field}
      {...props}
      name={name}
      loadOptions={loadOptions}
      components={components}
      value={field.value ? { label: field.value, value: field.value } : null}
      onChange={(option) => setValue(option.value)}
    />
  );
};
