import React from 'react';

import { validators } from './validators';

export const withValidate = (Wrapped, validateConfig) => {
    class Wrapper extends React.PureComponent {
        defaultErrorText = 'Это поле не должно быть пустым.'
        state = {
            errors: {}
        }
        constructor(props) {
            super(props);
        }
        validate(fieldsData) {
            let errors = {};
            const makeErr = (field) => {
                errors[field] = !!validateConfig[field] ? (validateConfig[field]['errorText'] || this.defaultErrorText) : this.defaultErrorText;
            }
            Object.keys(fieldsData).forEach(field => {
                if (!!validateConfig[field]['validator']) {
                    if (!validateConfig[field]['validator'](fieldsData[field], fieldsData)) {
                        makeErr(field);
                    }
                } else if (!Validators.REQUIRED(fieldsData[field])) {
                    makeErr(field);  
                }
            });
            this.setState({errors});
            return Object.keys(errors).length == 0;
        }
        render() {
            let { errors } = this.state;
            return (
                <Wrapped
                    errors={errors}
                    validate={(data) => this.validate(data)}
                    {...this.props} />
            )
        }
    }
    return Wrapper;
}