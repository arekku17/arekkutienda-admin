import { ProductSchemaType, ProductType } from '@/types/response'
import { FormikErrors, FormikTouched } from 'formik'
import React from 'react'

interface Props {
    errors: FormikErrors<ProductSchemaType>,
    touched: FormikTouched<ProductSchemaType>,
    name: keyof ProductSchemaType
}

const ErrorMesage = ({ errors, touched, name }: Props) => {
    return (
        <>
            {
                errors[name] && touched[name] ? (
                    <div className='text-red-300 mt-2'>{errors[name]}</div>
                ) : null
            }
        </>
    )
}

export default ErrorMesage