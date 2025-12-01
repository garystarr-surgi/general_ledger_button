from setuptools import setup, find_packages

setup(
    name='general_ledger_button',
    version='0.0.1',
    description='Add a print button to general ledger',
    author='SurgiShop',
    author_email='gary.starr@surgishop.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=['frappe']
)
