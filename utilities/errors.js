module.exports = {
    formatErrorMessages(errors) {
        const errorMessages = [];
        errors.forEach(error => {
            const field = error.type.split('.')[0];
            const type = error.type.split('.')[1];
            const value = error.context.key;

            if (type === 'empty') {
                const error = `${value} cannot be empty.`;
                errorMessages.push({ message: error });
            }

            if (field === 'string' && type === 'min') {
                const limit = error.context.limit;
                if (type === 'min') {
                    const error = `${value} must be at least ${limit} characters long.`;
                    errorMessages.push({ message: error });
                } else if (type === 'max') {
                    const error = `${value} must be less than or equal to ${limit} characters long.`;
                    errorMessages.push({ message: error });
                }
            }
        });

        return errorMessages;
    }
};