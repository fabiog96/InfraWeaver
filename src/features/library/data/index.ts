import { awsServices } from './aws-services';
import { genericServices } from './generic-services';

export { awsServices } from './aws-services';
export { genericServices } from './generic-services';
export { serviceCategories } from './categories';

export const allServices = [...awsServices, ...genericServices];
