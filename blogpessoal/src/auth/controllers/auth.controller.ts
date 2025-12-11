import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UsuarioLogin } from "../entities/usuariologin.entity";
import { LocalAuthGuard } from "../guard/local-auth.guard";
import { UsuarioResponse } from '../interfaces/usuario-response.interface';


@Controller('/usuarios')
export class AuthController{
constructor(private authService: AuthService){}


@UseGuards(LocalAuthGuard)
@HttpCode(HttpStatus.OK)
@Post('/logar')
login(@Body() usuario:UsuarioLogin): Promise<UsuarioResponse>{
 return this.authService.login(usuario);
}
}