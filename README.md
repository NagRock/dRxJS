# Typescript transformations using ngx-build-plus 

## Compiling the ngx-build-plus plugin

Run `tsc --skipLibCheck --module umd -w`.

## NG build using the plugin

Run `ng build --aot --plugin ~dist/out-tsc/ng-ts-register-transformer.js`.
