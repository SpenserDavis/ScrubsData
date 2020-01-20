const contact = {
  phone: { type: "string", example: "123-456-7890" },
  fax: { type: "string", example: "123-456-7890" },
  email: { type: "string", example: "bobsmith123@gmail.com" }
};

const gendersAccepted = {
  type: "string",
  enum: ["male", "female", "non-binary", "not applicable"]
};

const location = {
  type: "object",
  properties: {
    id: { type: "integer", format: "int32" },
    locationType: { type: "string", example: "physical address" },
    lineOne: { type: "string", example: "123 Fake St" },
    lineTwo: { type: "string", example: "Apt 502" },
    city: { type: "string", example: "Los Angeles" },
    state: { type: "string", example: "California" },
    zip: { type: "string", example: "90025" }
  }
};

const schedule = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "integer", format: "int32" },
      scheduleId: { type: "integer", format: "int32" },
      dayOfWeek: { type: "integer", format: "int32" },
      startTime: {
        type: "string",
        format: "date-time",
        example: "2019-12-04 19:44:39.0166667"
      },
      endTime: {
        type: "string",
        format: "date-time",
        example: "2019-12-04 19:44:39.0166667"
      }
    }
  }
};

const swagger = apiKey => {
  return {
    openapi: "3.0.0",
    info: {
      title: "API Documentation"
    },
    tags: [
      {
        name: "Providers",
        description: "Everything about providers"
      }
    ],
    //change this to live server upon publishing
    servers: [{ url: "https://scrubsdata.azurewebsites.net/dev" }],
    paths: {
      "/providers/affiliation?q={affiliation}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by affiliation",
          description: "Find all providers who possess a specified affiliation",
          operationId: "findProvidersByAffiliation",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "Cedars-Sinai"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "400": {
              description: "Invalid status value"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },
      "/providers/certification?q={certification}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by certification",
          description:
            "Find all providers who possess a specified certification",
          operationId: "findProvidersByCertification",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "CWTS"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description:
                "No providers exist with the specified specialization"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },

      "/providers/details": {
        get: {
          tags: ["Providers"],
          summary: "Fetches all providers and all associated information",
          description:
            "Includes professional details, affiliations, specializations, expertise, certifications, licenses, languages, practices",
          operationId: "getAllProviders",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description: "No providers in database"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },
      "/providers/expertise?q={expertise}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by expertise",
          description: "Find all providers who possess a specified expertise",
          operationId: "findProvidersByExpertise",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "spine"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description: "No providers exist with the specified expertise"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },

      "/providers/insuranceplan?q={insuranceplan}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by insurance plan",
          description:
            "Find all providers who possess a specified insurance plan",
          operationId: "findProvidersByInsurancePlan",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "Medical Plan"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description:
                "No providers exist within the specified insurance plan"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },

      "/providers/language?q={language}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by language",
          description: "Find all providers who possess a specified language",
          operationId: "findProvidersByLanguage",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "Achinese"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description: "No providers exist who speak the specified language"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },
      "/providers/{providerId}": {
        get: {
          tags: ["Providers"],
          summary: "Find provider by ID",
          description: "Returns a single provider",
          operationId: "getproviderById",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "providerId",
              in: "path",
              description: "Example:",
              required: true,
              style: "simple",
              explode: false,
              schema: {
                type: "integer",
                format: "int32",
                example: 8
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProviderDetails"
                  }
                }
              }
            },

            "404": {
              description: "provider not found"
            }
          },
          security: [
            {
              apiKey: []
            }
          ]
        }
      },
      "/providers/search?q={name}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by name",
          description: "Find all providers who possess a specified name",
          operationId: "findProvidersByName",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "danny"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description: "No provider exists with that name"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },

      "/providers/specialization?q={specialization}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by specialization",
          description:
            "Find all providers who possess a specified specialization",
          operationId: "findProvidersBySpecialization",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "Orthodontics"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description: "No providers exist with that specialization"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      },
      "/providers/license?q={state}": {
        get: {
          tags: ["Providers"],
          summary: "Finds providers by state",
          description: "Find all providers who possess a specified state",
          operationId: "findProvidersByState",
          parameters: [
            {
              name: "api-key",
              in: "header",
              description: "Example (your API key has been prefilled):",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                format: "uuid",
                example: apiKey
              }
            },
            {
              name: "q",
              in: "query",
              description: "Example:",
              required: true,
              // style: "form",
              explode: true,
              schema: {
                type: "string",
                example: "Hawaii"
              }
            }
          ],
          responses: {
            "200": {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProviderDetails"
                    }
                  }
                }
              }
            },
            "404": {
              description: "No providers exist within the specified state"
            }
          },
          security: [
            {
              providerstoreAuth: ["write:providers", "read:providers"]
            }
          ]
        }
      }
    },

    components: {
      schemas: {
        Affiliation: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            name: { type: "string", example: "Doctors for America" },
            type: { type: "string", example: "Non-Profit" }
          }
        },
        Certification: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            name: { type: "string", example: "CPCT" }
          }
        },
        Expertise: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            name: { type: "string", example: "spine" }
          }
        },
        Language: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            name: { type: "string", example: "english" }
          }
        },
        License: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            licenseNumber: {
              type: "integer",
              format: "int32",
              example: "D89GFDS9"
            },
            dateExpires: {
              type: "string",
              format: "date-time",
              example: "2019-12-04 19:44:39.0166667"
            },
            state: { type: "string", example: "Hawaii" }
          }
        },
        Practice: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            name: { type: "string", example: "Bob's Excellent Dental" },
            contact: {
              type: "object",
              properties: {
                ...contact,
                siteUrl: { type: "string", example: "bobsdental.com" }
              }
            },
            isAdaAccessible: { type: "boolean" },
            gendersAccepted,
            facilityType: { type: "string", example: "hospital" },
            location,
            schedule
          }
        },
        ProfessionalDetails: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            npi: { type: "integer", format: "int32" },
            gendersAccepted
          }
        },

        ProviderDetails: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int32"
            },

            firstName: {
              type: "string",
              example: "bob"
            },
            lastName: { type: "string", example: "smith" },
            gender: {
              type: "string",

              enum: ["male", "female", "non-binary", "not applicable"]
            },
            ...contact,
            dateAttested: {
              type: "string",
              format: "date-time",
              example: "2019-12-04 19:44:39.0166667"
            },
            compliant: { type: "string", enum: ["compliant", "non-compliant"] },
            professionalDetails: {
              $ref: "#/components/schemas/ProfessionalDetails"
            },
            practices: {
              type: "array",
              items: { $ref: "#/components/schemas/Practice" }
            },
            affiliations: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Affiliation"
              }
            },
            certifications: {
              type: "array",
              items: { $ref: "#/components/schemas/Certification" }
            },
            expertise: {
              type: "array",
              items: { $ref: "#/components/schemas/Expertise" }
            },
            languages: {
              type: "array",
              items: { $ref: "#/components/schemas/Language" }
            },
            licenses: {
              type: "array",
              items: { $ref: "#/components/schemas/License" }
            },
            specializations: {
              type: "array",
              items: { $ref: "#/components/schemas/Specialization" }
            }
          }
        },

        Specialization: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int32" },
            name: { type: "string", example: "Orthodontics" },
            isPrimary: { type: "boolean" }
          }
        }
      }
    }
  };
};

export default swagger;
