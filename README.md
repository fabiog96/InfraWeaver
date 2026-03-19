![Diagrammer Farm](/src/assets/images/logo.png)
# Diagrammer Farm

A web-based tool for visually designing cloud architectures on a canvas and generating production-ready **Terragrunt/Terraform** repositories from them — no manual HCL writing required.

## Features

### Canvas & Diagramming
- **Drag-and-drop canvas** powered by React Flow — infinite, pannable, zoomable
- **AWS service nodes** — 19 supported services with dedicated icons and categories
- **Generic nodes** — Server, Database, Storage, Compute, Network, Users, React, JSON, **Note**
- **Group nodes** — visual containers that map to Terragrunt folder hierarchy
- **Auto-parenting** — drag a node into a group to nest it automatically
- **Smart edges** — animated connections with configurable label and line style (solid/dashed/dotted)
- **Output mappings** — wire source outputs to target inputs directly on edges
- **Note nodes** — free-text nodes that display content directly on the canvas

### Packaged Modules
Pre-configured multi-node architectures draggable from the sidebar:
- **Serverless API** — API Gateway + Lambda + DynamoDB + IAM Role, wired and grouped

### Inspector Panel
- **Dynamic Terraform inputs** — schema-driven form generated from module definition
  - Dropdowns for enum fields: EC2 instance types, Lambda runtimes, RDS engines/instance classes, ElastiCache node types
- **Secrets management** — password fields with reveal toggle, source indicator (`env` / `secretsmanager` / `ssm`)
- **Module outputs** — read-only list of available Terraform outputs
- **Notes field** — free-text note per node, displayed as a preview on the canvas node
- **Edge output mappings** — map source module outputs to target module inputs via dropdowns

### HCL Generation Engine (live preview)
Every change to the canvas or inspector regenerates code in real time (debounced):

| File | Content |
|------|---------|
| `main.tf` | `resource` blocks from module definition |
| `variables.tf` | `variable` blocks with types and defaults |
| `outputs.tf` | `output` blocks with Terraform expressions |
| `terragrunt.hcl` | `include`, `dependency`, `inputs` blocks |
| `terragrunt.hcl` (root) | Remote state (S3 + DynamoDB lock), `generate "provider"` with `default_tags` |
| `_env/common.hcl` | Shared locals (region, environment, project) |

**Dependency engine** — edges generate `dependency {}` blocks with relative `config_path` and `dependency.X.outputs.Y` references in inputs.

### Code Panel (bottom panel)
- **Code tab** — file tree on the left, HCL preview on the right with line numbers
- **Problems tab** — validation messages with severity badges (errors/warnings count)

### Validation Engine
| Check | Severity |
|-------|----------|
| Required input not set | Error |
| Circular dependency detected | Error |
| Mixed module/non-module edge | Warning |
| Missing implicit dependency (e.g. VPC) | Warning |
| Invalid output mapping | Warning |
| Node not in a group | Info |

Visual feedback: error nodes show a red ring, warning nodes a yellow ring; edges follow the same color coding.

### Global Configuration
Accessible via the settings button in the TopBar:
- AWS Region
- Environment (`dev` / `staging` / `prod`)
- Project & Subproject name
- State bucket name (auto-derived, editable)
- DynamoDB lock table name (auto-derived, editable)
- CI/CD Provider (`GitHub Actions` / `GitLab CI` / `None`)

### Export
- **Terragrunt Project (.zip)** — full `infrastructure-live/` folder with all `.tf` + `.hcl` files, README, and CI/CD pipeline
- **PNG / JPG** — high-res canvas screenshot
- **JSON** — diagram data (nodes + edges)

The ZIP includes:
- All generated `main.tf`, `variables.tf`, `outputs.tf`, `terragrunt.hcl` per module
- Root `terragrunt.hcl` with remote state and provider config
- `_env/common.hcl` with shared locals
- `.github/workflows/deploy.yml` (GitHub Actions) or `.gitlab-ci.yml` (GitLab CI)
- `README.md` with prerequisites, quick start, module table, and env var list

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript + Vite |
| Canvas | React Flow (`@xyflow/react` v12) |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI |
| Icons | React Icons |
| Validation | Zod |
| ZIP export | JSZip |

---

## Project Structure

```text
src/
├── features/
│   ├── codegen/                  # HCL generation engine
│   │   ├── components/           # CodePanel, FileTree, CodeViewer, GlobalConfigPanel
│   │   ├── data/                 # Module registry + 19 AWS module definitions
│   │   ├── generators/           # hcl, variables, outputs, terragrunt, root, cicd, readme renderers
│   │   ├── hooks/                # useCodeGeneration
│   │   ├── stores/               # globalConfigStore, validationStore
│   │   ├── types/                # TerraformModule, ModuleInput, ResourceBlock...
│   │   ├── utils/                # export-to-zip
│   │   └── validators/           # diagram-validator (6 checks)
│   ├── editor/                   # Canvas, TechNode, GroupNode, SmartEdge, TopBar
│   ├── export/                   # PNG/JPG/JSON/ZIP export dialog and hook
│   ├── inspector/                # NodeForm, EdgeForm, ModuleInputsForm, SecretsForm, OutputsList
│   ├── library/                  # Service data (AWS/Generic), LibrarySidebar, drag hook
│   └── packaged-modules/         # Pre-configured multi-node modules (Serverless API)
├── shared/
│   ├── components/ui/            # Radix-based component kit
│   ├── icons/                    # ServiceIcon map
│   └── types/                    # DiagramNode, DiagramEdge, TechNodeData, EdgeData...
├── stores/
│   ├── diagramStore.ts           # Nodes, edges, selection, setNodeParent
│   └── uiStore.ts                # Sidebar toggles, CodePanel state, theme
├── App.tsx
└── main.tsx
```

### AWS Modules

| Module | Category | Notable inputs |
|--------|----------|----------------|
| `aws-lambda` | compute | runtime (dropdown), handler, memory_size, timeout |
| `aws-ec2` | compute | instance_type (dropdown ~70 types), ami, key_name |
| `aws-ecs` | compute | cpu, memory, image |
| `aws-eks` | compute | node_count, instance_types |
| `aws-api-gateway` | networking | name, protocol_type |
| `aws-elb` | networking | load_balancer_type, internal |
| `aws-route53` | networking | zone_name, record_type |
| `aws-cloudfront` | networking | origins, default_cache_behavior |
| `aws-vpc` | networking | cidr_block, enable_dns_support |
| `aws-dynamodb` | database | hash_key, billing_mode |
| `aws-rds` | database | engine (dropdown), instance_class (dropdown), identifier |
| `aws-elasticache` | database | engine (dropdown), node_type (dropdown) |
| `aws-s3` | storage | bucket, versioning |
| `aws-kinesis` | streaming | shard_count |
| `aws-sqs` | messaging | fifo_queue, visibility_timeout |
| `aws-sns` | messaging | name, subscriptions |
| `aws-cognito` | security | user_pool_name, mfa_configuration |
| `aws-iam` | security | name, policy_arns |
| `aws-sagemaker` | ml | instance_type, model_name |

---

## Getting Started

### Prerequisites

- Node.js v18+

### Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Build

```bash
npm run build
```

---

## Workflow

1. **Design** — drag AWS services or Packaged Modules onto the canvas
2. **Group** — drag nodes into Group nodes to define folder structure
3. **Configure** — click a node to fill Terraform inputs, secrets, and notes in the Inspector
4. **Connect** — draw edges between nodes; configure output→input mappings on each edge
5. **Preview** — open the Code Panel (bottom) to see live-generated HCL files
6. **Validate** — check the Problems tab for errors and warnings before exporting
7. **Configure globals** — set region, environment, project name, and CI/CD provider via the settings button
8. **Export** — download the full Terragrunt project as a ZIP, ready to `git init` and deploy
