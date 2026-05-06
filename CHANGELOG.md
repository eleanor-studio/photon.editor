# Changelog

All notable changes to the `photon-editor` library will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.1.html).

## [2.0.1] - 2026-05-06

### Documentation

- **Formalized API Reference**: Restructured the API documentation with standardized type signatures, parameter definitions, and return types.
- **Enhanced Technical Overview**: Expanded the technical architecture section to better explain the internal rendering pipeline and lifecycle.
- **Improved Usage Examples**: Added more descriptive code snippets for reactive state updates and asset hot-swapping.

---

## [2.0.0] - 2026-05-06

### Major Architectural Changes

- **Library/GUI Decoupling**: Extracted core orchestration logic into a standalone library package. The GUI implementation has been moved to a separate playground repository.
- **ESM Migration**: Transitioned from CJS/Global scripts to pure **ES Modules (ESM)**. The package now includes `exports` maps in `package.json` for modern module resolution.
- **Dependency Optimization**: Moved `three` to `peerDependencies` to ensure singleton instances of the Three.js engine in host applications.

### Technical Enhancements

- **Rendering Pipeline**: Updated default `WebGLRenderer` configuration to use `sRGBEncoding` for linear workflow compliance with GLTF assets.
- **Shadow Map Resolution**: Increased default shadow map size to `2048x2048` and switched to `PCFSoftShadowMap` for improved visual fidelity.
- **Animation System**: Refactored `loadModel` to utilize `THREE.AnimationMixer` more efficiently, allowing for seamless animation switching via the `path` setter.
- **API Surface**:
  - Introduced `perspective()` and `cameraPosition()` methods for granular scene control.
  - Improved `toggleInteractivity()` logic to use normalized device coordinates for bone rotation calculations.

---

## [1.0.1] - 2021-01-20

### Fixed

- Resolved minor issue in `handleWindowResize` where aspect ratio was not calculating correctly on certain mobile viewports.
- Fixed a bug where `shadowLight` frustum was too narrow for larger custom models.

### Changed

- Refined default lighting intensity for better material clarity.
- Updated README with clearer integration instructions.

---

## [1.0.0] - 2020-12-15

### Added

- Initial official release of the `PhotonEditor` core.
- Native support for GLTF/GLB asset loading via `GLTFLoader`.
- Implementation of the `AnimationMixer` for handling rigged character animations.
- Procedural joint-tracking system for Mixamo-rigged skeletons.
- Integrated `OrbitControls` for intuitive scene navigation.
