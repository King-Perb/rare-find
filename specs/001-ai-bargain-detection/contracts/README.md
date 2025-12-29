# API Contracts

This directory contains API specifications for the AI-Powered Bargain Detection System.

## Files

- `api-spec.md`: Human-readable API documentation with endpoints, request/response formats, and error handling
- `openapi.json`: OpenAPI 3.0 specification (to be generated)

## Usage

These contracts define the interface between the frontend and backend API routes. They should be:

1. **Implemented** in Next.js API routes (`src/app/api/`)
2. **Tested** with contract tests
3. **Documented** for frontend developers
4. **Versioned** if breaking changes are needed

## OpenAPI Specification

An OpenAPI 3.0 JSON specification will be generated from `api-spec.md` for:
- API client generation
- API documentation (Swagger UI)
- Contract testing
- Frontend type generation
