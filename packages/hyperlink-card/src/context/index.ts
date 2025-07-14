import { createContext } from '@lit/context';

export const customTitleContext = createContext<string | undefined>(Symbol('customTitle'));
export const customDescriptionContext = createContext<string | undefined>(
  Symbol('customDescription')
);
