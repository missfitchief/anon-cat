"""Add the approved raster identity as editable camera-facing alpha planes.
This is a 2.5D source, not a claimed rigged 3D cat. Architecture is true geometry.
Run after build_scene.py and after character PNG assets have been produced.
"""
import bpy, pathlib, math
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'art-source/blender/anon-cat-hideout.blend'))
scene=bpy.data.scenes['ANON_CAT_HIDEOUT'];bpy.context.window.scene=scene
scene.camera=bpy.data.objects['Desktop layer camera']
root=bpy.data.objects.new('CHARACTER_TRAVEL',None);scene.collection.objects.link(root)
root['identity']='approved orange cat / gray ribbed knitted disguise'
root['source_type']='layered 2.5D camera-facing illustration'
def layer(name,file,height,location):
    p=ROOT/'public/assets/character'/file
    if not p.exists():return None
    image=bpy.data.images.load(str(p),check_existing=True)
    width=height*image.size[0]/image.size[1]
    mesh=bpy.data.meshes.new(name+' image plane')
    mesh.from_pydata([(-width/2,0,0),(width/2,0,0),(width/2,height,0),(-width/2,height,0)],[],[(0,1,2,3)])
    mesh.uv_layers.new(name='UVMap')
    for poly in mesh.polygons:
        for li,uv in zip(poly.loop_indices,[(0,0),(1,0),(1,1),(0,1)]):mesh.uv_layers.active.data[li].uv=uv
    obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj);obj.parent=root;obj.location=location
    obj.rotation_euler=scene.camera.rotation_euler
    mat=bpy.data.materials.new(name+' alpha textile illustration');mat.use_nodes=True
    nodes=mat.node_tree.nodes;nodes.clear()
    tex=nodes.new('ShaderNodeTexImage');tex.image=image
    emission=nodes.new('ShaderNodeEmission');emission.inputs['Strength'].default_value=.85
    transparent=nodes.new('ShaderNodeBsdfTransparent');mix=nodes.new('ShaderNodeMixShader');out=nodes.new('ShaderNodeOutputMaterial')
    links=mat.node_tree.links;links.new(tex.outputs['Color'],emission.inputs['Color']);links.new(tex.outputs['Alpha'],mix.inputs[0]);links.new(transparent.outputs[0],mix.inputs[1]);links.new(emission.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],out.inputs['Surface'])
    mesh.materials.append(mat);image.pack();return obj
front=layer('CAT_FRONT_APPROVED','hero-cat.png',4.6,(0,-1,.06))
step=layer('CAT_STEP_APPROVED','step-cat.png',4.6,(0,-1,.06))
peek=layer('CAT_PEEK_APPROVED','peek-cat.png',1.35,(1.4,-1,3))
seat=layer('CAT_SEATED_APPROVED','seated-cat.png',3.4,(-4,-1,.05))
for obj in [step,peek,seat]:
    if obj:obj.hide_render=True;obj.hide_viewport=True
# Explicit reusable authoring actions. The web state machine consumes raster layers,
# not Blender's mixer, avoiding transform ownership conflicts.
def action(name,keyframes):
    root.animation_data_clear()
    for frame,loc in keyframes:
        root.location=loc;root.keyframe_insert(data_path='location',frame=frame)
    a=root.animation_data.action;a.name=name;a.use_fake_user=True
    return a
idle=action('idle',[(1,(0,0,0)),(84,(0,0,0)),(168,(0,0,0))])
action('hiding',[(1,(0,0,0)),(14,(.08,0,0)),(48,(2.7,0,0))])
action('peeking',[(1,(2.7,0,0)),(16,(2.4,0,0)),(60,(2.4,0,0))])
action('returning',[(1,(2.7,0,0)),(44,(0,0,0))])
root.animation_data.action=idle;scene.frame_set(1)
scene['animation_note']='Preview actions describe layer travel. Browser GSAP owns final timing and step/peek visibility. No runtime GLB or generative video.'
scene['export_note']='Architecture: 1400px RGBA Cycles PNG, 48 samples, AgX; WebP quality 88. Character RGBA masters packed into blend.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art-source/blender/anon-cat-hideout.blend'))
print('ANON_CAT_LAYERS_SAVED')
