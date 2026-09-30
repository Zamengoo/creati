export interface Contato {
  _id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  fotoId?: string; // ID do arquivo no GridFS retornado por POST /upload
}