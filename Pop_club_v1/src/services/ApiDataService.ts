import http from "../http-common";

class ApiDataService {
  getAll(queryParam:any): Promise<any> {
    return http.get("/image/validation/v1", {params: queryParam});
  }

  getById(id: any): Promise<any> {
    return http.get(`/image/validation/v1/${id}`);
  }

  create(data: any): Promise<any> {
    return http.post("/image/validation/v1", data);
  }

  update(data: any): Promise<any> {
    return http.put(`/image/validation/v1`, data);
  }

  updateShuffle(data: any): Promise<any> {
    return http.put(`/image/validation/v1/shuffle`, data);
  }

  delete(id: any): Promise<any> {
    return http.delete(`/image/validation/v1/${id}`);
  }
}

export default new ApiDataService();