namespace amiya;
using from '../db/schema';

service bill{
    entity normal as projection on amiya.Pradhan;
}
service billed{
    entity notnormal as projection on amiya.Pradhan;
}
