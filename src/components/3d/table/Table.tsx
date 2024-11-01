import { FC, useEffect, useState } from "react";
import { useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";

import textureMap_3 from "./Fabric_texture/Fabric037_2K-JPG_Color.jpg";
import textureRough_3 from "./Fabric_texture/Fabric037_2K-JPG_Roughness.jpg";
import textureDisp_3 from "./Fabric_texture/Fabric037_2K-JPG_Displacement.jpg";
import textureAO_3 from "./Fabric_texture/Fabric037_2K-JPG_AmbientOcclusion.jpg";
import textureNormal_3 from "./Fabric_texture/Fabric037_2K-JPG_NormalGL.jpg";

export const Table: FC = () => {
  const texture = useTexture(
    {
      map: textureMap_3.src,
      roughnessMap: textureRough_3.src,
      displacementMap: textureDisp_3.src,
      aoMap: textureAO_3.src,
      normalMap: textureNormal_3.src,
    },
    (textures) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (textures as any).forEach((texture: any) => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(8, 8);
      });
    }
  );
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () => {
      setSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* <mesh
        ref={boxRef}
        position={position}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        // ref={boxRef}
        // position={position}
        // onPointerDown={() => {
        //   toggleDragging(true);
        // }}
        // onPointerUp={() => {
        //   toggleDragging(false);

        //   setPosition(([x, y]) => [x, y, Z_POSITION]);
        // }}
        // onPointerMove={(e) => {
        //   if (!isDragging) {
        //     return;
        //   }

        //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        //   mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        //   raycaster.setFromCamera(mouse, three.camera);

        //   const intersects = raycaster.intersectObjects(
        //     boxRef.current ? [boxRef.current] : [],
        //     true
        //   );

        //   if (intersects.length > 0) {
        //     const intersect = intersects[0];

        //     const [x, y, z] = intersect.point.toArray();

        //     // console.log({ x, y, z });

        //     if (
        //       Math.abs(x) <= TABLE_WIDTH / 8 &&
        //       Math.abs(y) <= TABLE_HEIGHT / 8
        //     ) {
        //       setPosition([x, y, Z_POSITION + 2.5]);
        //     } else {
        //       toggleDragging(false);
        //       setPosition(([x, y]) => [x, y, Z_POSITION]);
        //     }
        //   }
        // }}
      >
        <boxGeometry args={[20, 20, 20]} />
        <meshStandardMaterial color={"red"} />
      </mesh> */}

      <mesh name="ground" position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[size.w * 2, size.h * 2, 1]} />
        <meshStandardMaterial
          map={texture.map}
          roughnessMap={texture.roughnessMap}
          displacementMap={texture.displacementMap}
          aoMap={texture.aoMap}
          normalMap={texture.normalMap}
          alphaTest={0.5}
          color={"yellow"}
        />
      </mesh>
    </>
  );
};
