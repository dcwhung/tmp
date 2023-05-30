import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

import { IModuleOptions } from '@app/common/interfaces';

@Global()
@Module({
 imports: [ConfigModule],
 providers: [],
 exports: [],
})

export class MongoDBModule {
 static forRootAsync(options: IModuleOptions | IModuleOptions[]): DynamicModule {
   const databases = Array.isArray(options) ? options : [options];

   const connections = databases.map(({ name }) =>
     MongooseModule.forRootAsync({
       inject: [ConfigService],
       useFactory: (configService: ConfigService) => {
         const dbOptions = {
           type: configService.get<string>(`${name}_TYPE`),
           uri: configService.get<string>(`${name}_URI`),
         }
          
         Logger.log(`[ - ${MongoDBModule.name} - ] 📝 Connecting ${dbOptions.type} database ${name} at ${dbOptions.uri}`);

         return {
           ...dbOptions,
         };
       },
     })
   );

   return {
     module: MongoDBModule,
     imports: [...connections],
     providers: [],
     exports: [],
   };
 }
  static forFeature(models: ModelDefinition[]) {
   return MongooseModule.forFeature(models);
 }
}
