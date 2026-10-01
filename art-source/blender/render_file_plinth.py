import bpy, pathlib
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'art-source/blender/anon-cat-hideout.blend'))
scene=bpy.data.scenes.new('ANON_CAT_FILE_PLINTH');bpy.context.window.scene=scene
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.render.resolution_x=900;scene.render.resolution_y=600;scene.render.resolution_percentage=100;scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.world=bpy.data.worlds.new('file room world');scene.world.use_nodes=True
bg=next(n for n in scene.world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs['Color'].default_value=(.7,.65,.55,1);bg.inputs['Strength'].default_value=.65
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,.65));obj=bpy.context.object;obj.name='editorial seat plinth';obj.scale=(2.35,1.4,1.3);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
mat=bpy.data.materials.get('charcoal matte plaster');obj.data.materials.append(mat)
bevel=obj.modifiers.new('soft seat edges','BEVEL');bevel.width=.025;bevel.segments=3;obj.modifiers.new('weighted normals','WEIGHTED_NORMAL')
d=bpy.data.lights.new('file softbox','AREA');light=bpy.data.objects.new('file softbox',d);scene.collection.objects.link(light);light.location=(-3,-4,7);d.energy=700;d.size=5;light.rotation_euler=(Vector((0,0,.7))-light.location).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('file plinth camera');cam=bpy.data.objects.new('file plinth camera',d);scene.collection.objects.link(cam);cam.location=(2,-14,4);cam.rotation_euler=(Vector((0,0,.7))-cam.location).to_track_quat('-Z','Y').to_euler();d.type='ORTHO';d.ortho_scale=3.5;scene.camera=cam
scene.view_settings.view_transform='AgX';scene.render.filepath=str(ROOT/'public/assets/environments/file-plinth.png');bpy.ops.render.render(write_still=True)
bpy.context.window.scene=bpy.data.scenes['ANON_CAT_HIDEOUT']
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art-source/blender/anon-cat-hideout.blend'))
