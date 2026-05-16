import { useEffect, useRef } from "react";

import * as OBC from "@thatopen/components";

function FloorPlan3D({ ifcpath }) {
    const containerRef = useRef(null)
    useEffect(() => {
        if (!containerRef.current) return;
        const components = new OBC.Components();
        const worlds = components.get(OBC.Worlds)
        const world = worlds.create();
        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        components.init();
        world.scene.setup();
        async function loadIfc() {
            // 1. get the IFC loader from components
            const ifcLoader = components.get(OBC.IfcLoader)
            // 2. set the WASM path
            ifcLoader.settings.wasm = {
                path: '/',
                absolute: false,
            };
            // 3. call setup
            // 4. fetch the file, load it, add to scene
        }
        loadIfc()
    }, [ifcpath])
    return <div ref={containerRef}>


    </div>

}

export default FloorPlan3D