from setuptools import setup

package_name = 'final'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='multicampus',
    maintainer_email='skk7541@gmail.com',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'final = final.final:main',
            'a_star = final.a_star:main',
            'a_star_local_path = final.a_star_local_path:main',
            # 'ex_calib = sub2.ex_calib:main',
            # 'human_detector = sub2.human_detector:main',
            'load_map = final.load_map:main',
            'odom = final.odom:main',
            'path_tracking = final.path_tracking:main',
            'control_hub = final.control_hub:main'
            # 'seg_binarizer = sub2.seg_binarizer:main',
            # 'cleaning2 = sub2.cleaning2:main'
        ],
    },
)
