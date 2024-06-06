import { useMemo } from 'react';
import { Validation } from '@rearden/ui/components/input';

export const useValidationResult = (validations: Validation[], value: string) => {
  const validationResult = useMemo(() => {
    const results = validations.filter(v => v.checkFn(value));
    const error = results.find(v => v.type === 'error');
    return error ? error : results.find(v => v.type === 'warn');
  }, [value, validations]);

  return validationResult;
};
