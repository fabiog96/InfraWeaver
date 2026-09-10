# Changelog

## 1.0.0 (2026-09-10)


### ⚠ BREAKING CHANGES

* 💥 enter directly on the Designer and switch modes from the top bar ([#28](https://github.com/fabiog96/InfraWeaver/issues/28))

### Features

* ✨ add 39 AWS service definitions with Terraform module configurations ([f06fffa](https://github.com/fabiog96/InfraWeaver/commit/f06fffabeb0d069db5db8d6ac92fe47033dc32b9))
* ✨ add TextNode type with editor, inspector form, and drag-to-canvas support ([6065f38](https://github.com/fabiog96/InfraWeaver/commit/6065f38d30d51b990e0306f9c2ab738ef961d309))
* ✨ enhance visualizer with GitHub integration, project discovery, and sidebar ([9a1015b](https://github.com/fabiog96/InfraWeaver/commit/9a1015b4e85fd505b4771901cf23c0933535dbd3))
* ✨ group visualizer resources by source file with cross-file edges ([b6782f1](https://github.com/fabiog96/InfraWeaver/commit/b6782f15e5fa85da388225ff9a11bc43b6fb4322))
* 💥 enter directly on the Designer and switch modes from the top bar ([#28](https://github.com/fabiog96/InfraWeaver/issues/28)) ([e571d6f](https://github.com/fabiog96/InfraWeaver/commit/e571d6f5c02414d1440c44350747dac550137c05))
* add Designer Guide page and integrate it into the router ([f454c56](https://github.com/fabiog96/InfraWeaver/commit/f454c566ae59eba02e592ad91a1940c3ea40d407))
* add GitHub Pages deployment workflow ([27970e0](https://github.com/fabiog96/InfraWeaver/commit/27970e039449861c457d215311c5a842059b3aa6))
* add GitHub Pages deployment workflow ([babfa23](https://github.com/fabiog96/InfraWeaver/commit/babfa235cb5009fc84eacf292a329ab3ca7d1fd4))
* Add GitHub token guide page and link in settings panel ([c033c90](https://github.com/fabiog96/InfraWeaver/commit/c033c9065c0a791879529d82a9535d88c475ca15))
* add group node support with new icon and drag functionality ([010979c](https://github.com/fabiog96/InfraWeaver/commit/010979c4daf196bbb19438c043bab79c649a7dc9))
* Add HomePage and LandingPage components with styling ([c04a631](https://github.com/fabiog96/InfraWeaver/commit/c04a631237414a5a61ed9867b7979a23e077c79a))
* add Logo component and integrate it into TopBar, LandingPage, and VisualizerPage; add favicon ([4523704](https://github.com/fabiog96/InfraWeaver/commit/45237049fa121e264c0618d7205678849082c5b1))
* add placeholder for future canvas actions including undo/redo, copy/paste, multi-select, and group actions ([e5f3e4b](https://github.com/fabiog96/InfraWeaver/commit/e5f3e4b7fe114828a2bc46b2e704580deac2d9f5))
* add resolver implementations for relationships, modules, and Terragrunt dependencies with type definitions ([45ce630](https://github.com/fabiog96/InfraWeaver/commit/45ce6301963d9ef08156fe5e10c47c23cf2460ea))
* implement diagram import functionality with file upload support ([6f3e608](https://github.com/fabiog96/InfraWeaver/commit/6f3e6082822dc967598567d7984136b1b79258dd))
* implement routing and create landing, designer, and visualizer pages ([f4737eb](https://github.com/fabiog96/InfraWeaver/commit/f4737ebc7d13fb73d74dd02184f811bbbe87df76))
* phase2 - add HCL parsing capabilities with support for Terragrunt configurations and resource reference extraction ([c745cfc](https://github.com/fabiog96/InfraWeaver/commit/c745cfc19e5200972d8db2bb1b7b7f926265a4bb))
* Refactor UI components to remove Radix dependencies and implement custom dialog, select, tabs, and tooltip components ([2f8f11e](https://github.com/fabiog96/InfraWeaver/commit/2f8f11ee57577228427a8a67c248d654c99d3fa2))
* replace aws-icons with @cloud-icons/react for AWS icons and update icon mapping ([e1c4468](https://github.com/fabiog96/InfraWeaver/commit/e1c44685b7627e3f54d3ff5ee7302703dddc17bd))
* **visualizer:** implement read-only visualizer canvas and inspector ([b01f696](https://github.com/fabiog96/InfraWeaver/commit/b01f6967c51ea16789f446043da46639f633623c))


### Bug Fixes

* 🐛 clear the three pre-existing eslint errors on main ([#27](https://github.com/fabiog96/InfraWeaver/issues/27)) ([bef305d](https://github.com/fabiog96/InfraWeaver/commit/bef305d8810b28b15f9f7ba3ff75ce7bed83f3c6))
* 🐛 store the GitHub PAT in sessionStorage instead of localStorage ([#25](https://github.com/fabiog96/InfraWeaver/issues/25)) ([060428a](https://github.com/fabiog96/InfraWeaver/commit/060428af8f68bf270337002101678c9fc2dfc2c3))
* add new generic node and clean some unsed code ([fa967d3](https://github.com/fabiog96/InfraWeaver/commit/fa967d31225e2f9fd7db39cd8da8d7332afafa7e))
* add new modules + fix dark mode color ([cc7eb5f](https://github.com/fabiog96/InfraWeaver/commit/cc7eb5fd8d9811c90a9698b03b8c671b309d8b68))
* clear code ([de9aeb0](https://github.com/fabiog96/InfraWeaver/commit/de9aeb04504a01341ab5afb7ad7db468cf0f8fb8))
* Correct casing for project name and base path in configuration files ([96ce86c](https://github.com/fabiog96/InfraWeaver/commit/96ce86c8127409a05b903cdf17d2e68ff8afd111))
* correct router configuration and ensure proper basename in router setup ([1f83f83](https://github.com/fabiog96/InfraWeaver/commit/1f83f833c2b6479ca8966cae5c07e18a0fa86dd6))
* fixed layout VizEdge - now we can show only the edges of the selected node ([9d0b33f](https://github.com/fabiog96/InfraWeaver/commit/9d0b33facef77f4d5b545dce11956c2d8c3f8695))
* highlighter hcl code ([0241521](https://github.com/fabiog96/InfraWeaver/commit/02415213ba8e7d6a034bf56bd5cd21017a6cb701))
* remove unused syncStatus variable from GitHubSettings component ([eafdc39](https://github.com/fabiog96/InfraWeaver/commit/eafdc397f7f1de057f9f45cec2c81c145e265d42))


### Performance Improvements

* ⚡️ precompute validation status maps in the store ([#26](https://github.com/fabiog96/InfraWeaver/issues/26)) ([5221464](https://github.com/fabiog96/InfraWeaver/commit/522146468376c4297b79a61c3a5b9ed3ae1ace15))
