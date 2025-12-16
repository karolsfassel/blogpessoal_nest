import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Postagem } from "../../postagem/entities/postagem.entity";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'tb_usuarios'})
export class Usuario{

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @IsNotEmpty()
    @Column({length:255, nullable:false})
    nome: string;

    @ApiProperty({example:'email@email,com.br'})
    @IsEmail()
    @IsNotEmpty()
    @Column({length:255, nullable:false})
    usuario:string;

    @MinLength(8)
    @IsNotEmpty()
    @Column({length:255, nullable:false})
    senha:string;

    @ApiProperty()
    @Column({length:5000})
    foto:string;

    @ApiProperty()
    @OneToMany(() => Postagem, (postagem) => postagem.usuario)
    postagem: Postagem[];
}