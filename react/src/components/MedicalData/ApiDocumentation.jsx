import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const ApiDocumentation = () => <SwaggerUI spec={"./openapi.json"} />;

export default ApiDocumentation;
