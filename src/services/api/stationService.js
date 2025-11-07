import { getApperClient } from "@/services/apperClient";

const stationService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('station_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "name_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching stations:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    if (!query || query.length < 2) return [];
    
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('station_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "name_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "city_c", "operator": "Contains", "values": [query]},
                {"fieldName": "code_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching stations:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.getRecordById('station_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "name_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching station ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCode(code) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('station_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "name_c"}}
        ],
        where: [{
          "FieldName": "code_c",
          "Operator": "EqualTo",
          "Values": [code]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching station by code ${code}:`, error?.response?.data?.message || error);
      return null;
    }
  }
};

export default stationService;