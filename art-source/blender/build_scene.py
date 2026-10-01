"""Dedicated layered 2.5D scene. Run with Blender --background --python build_scene.py.
Never removes objects from an existing scene. All project geometry lives in ANON_CAT_HIDEOUT.
"""
import bpy, math, pathlib, json
from mathutils import Vector
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/assets/environments'
OUT.mkdir(parents=True, exist_ok=True)
scene = bpy.data.scenes.new('ANON_CAT_HIDEOUT')
bpy.context.window.scene = scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1400
scene.render.resolution_y = 1400
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.world = bpy.data.worlds.new('ANON_CAT_WORLD')
scene.world.use_nodes = True
bg = next(n for n in scene.world.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs['Color'].default_value = (.18,.19,.21,1)
bg.inputs['Strength'].default_value = .35
def material(name, rgb, roughness=.88, emission=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    p.inputs['Base Color'].default_value=(*rgb,1)
    p.inputs['Roughness'].default_value=roughness
    if emission:
        p.inputs['Emission Color'].default_value=(*rgb,1)
        p.inputs['Emission Strength'].default_value=emission
    return m
coal=material('charcoal matte plaster',(.065,.073,.083))
edge=material('deep charcoal',(.026,.03,.035))
orange=material('warm orange opening',(1,.22,.024),.7,1.4)
floorMat=material('quiet dark ground',(.047,.053,.061))
def cube(name, loc, scale, mat, bevel=.018):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object;o.name=name;o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat)
    if bevel:
        mod=o.modifiers.new('soft architectural edge','BEVEL');mod.width=bevel;mod.segments=3
        o.modifiers.new('weighted corner normals','WEIGHTED_NORMAL')
    return o
floor=cube('ground slab',(0,1,-.17),(10,9,.3),floorMat)
back=cube('offset rear wall',(.3,2.3,2.9),(5.5,.55,5.8),coal)
opening=cube('orange inner reveal',(.35,1.97,2.62),(1.45,.07,4.3),orange)
left=cube('left doorway jamb',(-.87,1.65,2.85),(1,.85,5.7),edge)
right=cube('right doorway jamb',(1.48,1.65,2.85),(.84,.85,5.7),coal)
lintel=cube('doorway top',(.3,1.65,5.23),(3.2,.85,.94),coal)
fore=cube('foreground concealment slab',(2.68,-.65,2.2),(1.55,1.2,4.4),edge)
def area(name, loc, energy, color, size, target):
    d=bpy.data.lights.new(name,'AREA');o=bpy.data.objects.new(name,d);scene.collection.objects.link(o)
    o.location=loc;d.energy=energy;d.color=color;d.shape='DISK';d.size=size
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('large softbox',(-3,-4,7),900,(1,.91,.81),6,(0,0,2))
area('cool edge',(4,3,7),700,(.64,.71,1),4,(0,0,2))
area('orange passage bounce',(.3,1.4,3),180,(1,.25,.055),2,(0,-2,2))
def camera(name,loc,target,ortho):
    d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);scene.collection.objects.link(o)
    o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=ortho
    return o
desktop=camera('Desktop layer camera',(6,-13,7),(0,0,2.5),8.1)
mobile=camera('Mobile layer camera',(3.2,-14,6.1),(.3,0,2.5),7.4)
scene.camera=desktop
scene.view_settings.view_transform='AgX'
fore.hide_render=True
scene.render.filepath=str(OUT/'hideout-back.png')
bpy.ops.render.render(write_still=True)
# Alpha foreground keeps physical camera geometry and depth consistent with the background.
for o in [back,opening,left,right,lintel,floor]:o.hide_render=True
fore.hide_render=False
scene.render.filepath=str(OUT/'hideout-front.png')
bpy.ops.render.render(write_still=True)
for o in [back,opening,left,right,lintel,floor]:o.hide_render=False
scene.camera=mobile;fore.hide_render=True
scene.render.filepath=str(OUT/'hideout-mobile.png')
bpy.ops.render.render(write_still=True)
scene.camera=desktop;fore.hide_render=False
scene['pipeline']='Blender-rendered architecture + transparent character planes; GSAP browser state machine'
scene['palette']='#111315 #282B2E #73767A #F2EFE8 #FF861C'
scene['source_reference']='https://wodlwodl.com/'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art-source/blender/anon-cat-hideout.blend'))
print('ANON_CAT_SCENE_COMPLETE')
