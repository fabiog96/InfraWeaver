<p align="center">
  <img src="public/favicon.svg" alt="InfraWeaver logo" width="80" />
</p>

<h1 align="center">INFRAWEAVER</h1>

<p align="center">
  Design cloud architectures visually. Export production-ready Terraform & Terragrunt — zero HCL writing required.
</p>

---

## What is InfraWeaver?

InfraWeaver turns a visual canvas into a fully structured **Terraform/Terragrunt** repository. Draw your architecture, configure your resources, and download a deployment-ready project in seconds.

It works in two modes:

- **Designer** — build cloud architectures from scratch on an infinite canvas, and generate all the IaC code automatically
- **Visualizer** — import an existing Terraform repo from GitHub and explore your infrastructure as an interactive diagram

---

## Key Capabilities

### Design with drag-and-drop

Drag **60+ AWS services** and generic components onto the canvas, group them into logical folders, and connect them with smart edges. InfraWeaver handles the rest: dependencies, variable wiring, and folder structure.

### Pre-built architecture templates

Start fast with **Packaged Modules** — pre-configured multi-resource patterns like Serverless API, CloudFront + S3, ECS Microservice, ETL Pipeline, and more. Drop them on the canvas fully wired and ready to customize.

### Live code generation

Every change on the canvas is reflected in real time. The Code Panel shows a complete file tree with all generated `main.tf`, `variables.tf`, `outputs.tf`, `terragrunt.hcl`, root configuration, CI/CD pipelines, and README — all kept in sync as you design.

### Smart validation

A built-in validation engine catches errors before you export: missing required inputs, circular dependencies, broken output mappings, missing implicit dependencies (like a VPC), and more. Visual rings on the canvas give immediate feedback.

### Configurable infrastructure settings

Set AWS region, environment (`dev` / `staging` / `prod`), project name, remote state backend (S3 + DynamoDB lock), and CI/CD provider (GitHub Actions, GitLab CI) — all baked into the generated code with proper `default_tags`.

### Export anything

| Format | What you get |
|--------|-------------|
| **Terragrunt Project (.zip)** | Full `infrastructure-live/` repo — ready to `git init && terragrunt run-all apply` |
| **PNG / JPG** | High-resolution canvas screenshot |
| **JSON** | Diagram data for backup and re-import |

### Visualize existing infrastructure

Point InfraWeaver at a GitHub repository containing Terraform files. It parses HCL, discovers projects and modules, and renders an interactive graph — grouped by project, subproject, and source file.

---

## Supported AWS Services

Compute, Storage, Database, Networking, Messaging, Security, Analytics, ML, Streaming, and more — including Lambda, EC2, ECS, EKS, S3, DynamoDB, RDS, ElastiCache, API Gateway, CloudFront, VPC, SQS, SNS, Cognito, IAM, SageMaker, Kinesis, Route 53, and ELB.

Each service comes with schema-driven input forms, enum dropdowns (instance types, runtimes, engines), secrets management, and output definitions.

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and start designing.

---

## Workflow

1. **Drag** services or packaged modules onto the canvas
2. **Group** nodes into folders to define your Terragrunt structure
3. **Configure** each resource from the Inspector panel
4. **Connect** nodes and map outputs to inputs on each edge
5. **Review** the live-generated code and fix any validation warnings
6. **Export** the full Terragrunt project as a ZIP — deploy-ready
