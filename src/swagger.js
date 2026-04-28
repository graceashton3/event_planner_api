import YAML from 'yamljs';

const swaggerDocument = YAML.load('./docs/openapi.yaml');

export default swaggerDocument;