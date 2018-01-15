import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from pylons.config import config as cf

class Rtpa_Tet_Dataset_CombinationPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IResourceView, inherit=True)

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('fanstatic', 'rtpa_tet_dataset_combination')
                
    def can_view(self, data_dict):
        return True    
    
    def info(self):
        return { 
                 'name': 'rtpatetdatasetcombination',
                 'title': 'Dataset Combination',
                 'icon': 'table',
                 'default_title': 'Dataset Combination',
               }
               
               
               
    def view_template(self, context, data_dict):
		return "rtpatetdatasetcombination-view.html"

    def setup_template_variables(self, context, data_dict):
		query_api=cf.get('ckan.site_url','http://127.0.0.1')+'/api/action/datastore_search_sql'
		return {'dataset_resource_id':data_dict['resource']['id'],
				'QUERY_API': query_api}
               
