import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPassword } from 'apiSdk/passwords';
import { Error } from 'components/error';
import { passwordValidationSchema } from 'validationSchema/passwords';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PasswordInterface } from 'interfaces/password';

function PasswordCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PasswordInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPassword(values);
      resetForm();
      router.push('/passwords');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PasswordInterface>({
    initialValues: {
      password: '',
      length: 0,
      complexity: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: passwordValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Password
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="password" mb="4" isInvalid={!!formik.errors?.password}>
            <FormLabel>Password</FormLabel>
            <Input type="text" name="password" value={formik.values?.password} onChange={formik.handleChange} />
            {formik.errors.password && <FormErrorMessage>{formik.errors?.password}</FormErrorMessage>}
          </FormControl>
          <FormControl id="length" mb="4" isInvalid={!!formik.errors?.length}>
            <FormLabel>Length</FormLabel>
            <NumberInput
              name="length"
              value={formik.values?.length}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('length', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.length && <FormErrorMessage>{formik.errors?.length}</FormErrorMessage>}
          </FormControl>
          <FormControl id="complexity" mb="4" isInvalid={!!formik.errors?.complexity}>
            <FormLabel>Complexity</FormLabel>
            <Input type="text" name="complexity" value={formik.values?.complexity} onChange={formik.handleChange} />
            {formik.errors.complexity && <FormErrorMessage>{formik.errors?.complexity}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'password',
    operation: AccessOperationEnum.CREATE,
  }),
)(PasswordCreatePage);
