import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IModuleOptions } from '@app/common/interfaces';
import { OrmModule } from '@app/common/abstract/database/';

@Global()
@Module({
 imports: [ConfigModule],
 providers: [],
 exports: [],
})

export class PostgreSQLModule extends OrmModule {
 static forRootAsync(options: IModuleOptions | IModuleOptions[]): DynamicModule {
    return this._forRootAsync(PostgreSQLModule.name, options);
 }
}
