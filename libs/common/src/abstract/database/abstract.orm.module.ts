import { DynamicModule, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IModuleOptions } from '@app/common/interfaces';

export abstract class OrmModule {
 static _forRootAsync(moduleName:string, options: IModuleOptions | IModuleOptions[]): DynamicModule {
   const databases = Array.isArray(options) ? options : [options];

   const connections = databases.map(({ name }) =>
     TypeOrmModule.forRootAsync({
       inject: [ConfigService],
       useFactory: (configService: ConfigService) => {
         const dbOptions = {
           type: configService.get<string>(`${name}_TYPE`),
           host: configService.get<string>(`${name}_HOST`),
           port: configService.get<number>(`${name}_PORT`),
           username: configService.get<string>(`${name}_USER`),
           password: configService.get<string>(`${name}_PWD`),
           database: configService.get<string>(`${name}_NAME`),
         }
          
         Logger.log(`[ - ${moduleName} - ] 📝 Connecting ${dbOptions.type} database ${name} at ${dbOptions.type}://${dbOptions.host}:${dbOptions.port}/${dbOptions.database}`);

         return {
           ...dbOptions,
           autoLoadEntities: true,
           synchronize: true,
         };
       },
     })
   );


   return {
     module: OrmModule,
     imports: [...connections],
     providers: [],
     exports: [],
   };
 }

 static forFeature(entities?: any[]) {
   /** TODO: Current version doesn't support datasource */
   return TypeOrmModule.forFeature(entities);
 }
}

