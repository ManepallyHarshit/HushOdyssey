# Unity WebGL Build

Place your Unity WebGL export files here:

```
frontend/public/unity/Build/
├── WebGL.loader.js
├── WebGL.data
├── WebGL.framework.js
└── WebGL.wasm
```

## How to export from Unity

1. Open the HushCat project in Unity.
2. Go to **File → Build Settings**.
3. Select **WebGL** as the platform. Switch Platform if needed.
4. In **Player Settings → Resolution and Presentation**, set the template to `Default` (or your custom HushTemplate).
5. Set the Output Path to this folder: `hush-odyssey/frontend/public/unity/`.
6. Click **Build**.
7. Rename the build output files if necessary to match the names above (`WebGL.*`).

Once the files are here, `npm run dev` in `frontend/` will automatically load the game.
