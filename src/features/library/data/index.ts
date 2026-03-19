import { awsServices } from './aws-services';
import { azureServices } from './azure-services';
import { gcpServices } from './gcp-services';
import { genericServices } from './generic-services';

export { awsServices } from './aws-services';
export { azureServices } from './azure-services';
export { gcpServices } from './gcp-services';
export { genericServices } from './generic-services';
export { serviceCategories } from './categories';

export const allServices = [...awsServices, ...azureServices, ...gcpServices, ...genericServices];
