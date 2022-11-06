import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { ControllerRoute } from '@loopback/rest';
import { Llaves } from '../config/llaves';
import { Usuario } from '../models';
import { UsuarioRepository } from '../repositories';
const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require(`jsonwebtoken`);
@injectable({scope: BindingScope.TRANSIENT})

export class AutenticacionService {
//  constructor(/* Add @inject to inject parameters */) {} Agregar inyeccione repositorio que tiene propiedades de los diferentes modelos es basicamanate la tabla
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository
  
    ) {}

  /*
   * Add service methods here
   */
  GenerarClave(){
    let clave = generador(8,false)
    return clave
  }

  CifrarClave(clave:string){
    let clavecifrada = cryptoJS.MD5(clave).toString();
    return clavecifrada;
  }
   
  IdentificarUsuario(usuario : string, contrasena: string){
    try{
      let p = this.usuarioRepository.findOne({where: {corre: usuario,contrasena: contrasena} });
      if(p){
        return p;
      }
        return false
    }catch{
      return false;
    }
  }  

  GenerarTokenJWT(usuario: Usuario){
    let token = jwt.sign({
      data: {
        id: usuario.id,
        correo: usuario.corre,
        nombre: usuario.nombre
      }
    },
    Llaves.claveJWT);
    return token;
  }

  ValidarTokenJWT(token: string): any{
    try{
      let datos = jwt.verify(token,Llaves.claveJWT);
      return datos;
    }catch{
      return false;
    }
  }
}
