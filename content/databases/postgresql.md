# Postgresql

PostgreSQL 是一个免费的对象-关系数据库服务器(ORDBMS)，在灵活的 BSD 许可证下发行。

官网地址：https://www.postgresql.org/

## 数据库安装

```
yum install postgresql
```

## 数据库启动停止

```
systemctl start postgresql
systemctl stop postgresql
```

Postgresql 数据文件目录`/var/lib/postgres`，使用的端口`5432`

## pg9.4 启动脚本

```
#!/bin/bash
#su - postgres -c "/usr/pgsql-9.4/bin/postmaster -D /var/lib/pgsql/9.4/data/"
su - postgres -c "/usr/pgsql-9.4/bin/pg_ctl -D /var/lib/pgsql/9.4/data/ -l logfile start"
```

## pg9.4 关闭脚本

```
#!/bin/bash
su - postgres -c "kill -INT `head -1 /var/lib/pgsql/9.4/data/postmaster.pid`"
```

## pg9.4 安装脚本

```
#!/bin/bash
# install pg9.4 for centos7
type wget >/dev/null 2>&1 || { echo >&2 "I require wget but it's not installed. I will install it!";yum install -y wget; }
echo "Downloading pg9.4"
wget -c https://download.postgresql.org/pub/repos/yum/9.4/redhat/rhel-7-x86_64/pgdg-centos94-9.4-3.noarch.rpm && rpm -ivh pgdg-centos94-9.4-3.noarch.rpm && yum install postgresql94-server -y
/usr/pgsql-9.4/bin/postgresql94-setup initdb

echo "Install Done!"
```

## 登录 postgresql

使用 rd 登录 postgresql

```
psql -h 192.168.11.110 -U rd -d postgres
```

php 无法连接 pg 数据库的时候，最后最好检查一下是否开启了 selinux

## 创建用户

例如创建张三

```
zhangsan 为用户名，修改成你自己的用户名
123123 为密码，修改你自己的密码

postgres=> create user zhangsan createdb password '123123';
```

## 创建用户，并赋予查询权限。

```
create role read;
alter role read login;
alter role password '123123';
grant select on all tables in schema public to read;
```

## 创建数据库

使用创建的用户名及密码登录

```
psql -h 192.168.11.110 -U zhangsan -d postgres
```

例如创建数据库 demo_production

```
postgres=> create database demo_production;
```

## 备份数据库

使用创建的用户名和密码

```
pg_dump -h 192.168.11.110 -U zhangsan demo_production > demo_production.dmp
zhangsan 为用户名，
demo_production 为数据库名
demo_production.dmp 为备份的文件名
```

## 备份数据库时传入密码

1，使用环境变量 PGPASSWORD

```
export PGPASSWORD="PG密码"
pg_dump -U user > pg.dump

或放在一行中
PGPASSWORD="PG密码" pg_dump -U user > pg.dump
```

注意：这种方法因为安全性问题，不推荐使用。

2，使用.pgpass 文件

在主目录下创建.pgpass 文件，并将权限调整为 0600，文件内容为：

```
hostname:port:database:username:password
```

## 还原数据库

使用创建的用户名和密码

```
psql -h 192.168.11.110 -U zhangsan -d demo_production < demo_production.dmp
```

## 还原数据库 2

```
gunzip -c demo_production_20170814.gz |psql -h 192.168.10.77 -U zhangsan demo_production
```

## 创建表索引

使用索引时，需要考虑下列准则：

- 索引不应该使用在较小的表上。
- 索引不应该使用在有频繁的大批量的更新或插入操作的表上。
- 索引不应该使用在含有大量的 NULL 值的列上。
- 索引不应该使用在频繁操作的列上。

```
-- 单列索引
CREATE INDEX index_name
ON table_name (column_name);
-- 多列索引
CREATE INDEX index_name
ON table_name (column1_name, column2_name);
```

## 删除表索引

```
DROP INDEX index_name;
```

## 删除还有活动连接的 pg 数据库

使用下面的语句中止活动连接，然后删除数据库

```
select pg_terminate_backend(pid) from pg_stat_activity where datname='nc_dove_production' and pid<>pg_backend_pid();
```

pg_stat_activity 是一个系统视图，每一行代表一个服务进程的属性和状态
boolean pg_terminate_backend(pid int)是一个系统函数，用于终止一个后端服务进程
int pg_backend_pid()系统函数用于获取附加到当前会话的服务器进程 ID

## 查看是否有锁

```
select * from pg_locks where not granted;
```

## 慢查询和全表扫描的查询

```
select * from pg_stat_statements where calls > 0 order by total_time / calls desc limit 10; select * from pg_stat_all_tables where seq_scan > 0 order by seq_scan desc limit 10;
```

## 安装 contrib，解决没有 pg_stat_statements

```
yum install postgresql94-contrib
```

然后再配置文件 postgresql.con 中配置

```
shared_preload_libraries = 'pg_stat_statements'         # (change requires restart)
pg_stat_statements.max = 1000
pg_stat_statements.track = all
```

最后在数据库中执行

```
create extension pg_stat_statements
```

## 查询最大连接数

```
--当前总共正在使用的连接数
postgres=# select count(1) from pg_stat_activity;

--显示系统允许的最大连接数
postgres=# show max_connections;

--显示系统保留的用户数
postgres=# show superuser_reserved_connections ;

--按照用户分组查看
select usename, count(*) from pg_stat_activity group by usename order by count(*) desc;
```

## 更新某些字符串

当你的表中有一个字段里面的内容，某些要更改，例如将 code 字段内容中的 L0 修改为 LO，请使用下面的命令。

```
update storage_positions set code =replace(code,'L0','LO');
```

## 修改列名

```
alter table 表名 rename column 老字段名 to 新字段名;
```

## 修改表名

```
alter table 老表名 rename to 新表名;
```

## 添加新字段

```
alter table 表名 add column 字段名 数据类型 限制;
```

## 修改字段类型
```
alter table 表名 alter column 字段名 type 字段类型 using 字段新类型;
或者
alter table 表名 alter 字段名 type 新字段类型;
```

## 删除字段

```
alter table 表名 drop 字段名;
```

## 使脚本在事务中运行

```
psql -l -f myscript.sql
psql --single-transaction -f myscript.sql
```

## 使脚本遇到错误停止

```
psql -f test.sql -v ON_ERROR_STOP=on
```

## 动态制造脚本(make-script.sql)

```
file:make-script.sql
\t on
\o script-:i.sql
select sql from (
select 'alter table ' || n.nspname || '.' || c.relname || ' add column last_update_timestamp timestamp with time zone default now();' as sql ,
row_number() over (order by pg_relation_size(c.oid))
from pg_class c
join pg_namespace n
on c.relnamespace = n.oid
where n.nspname = 'test'
order by 2 desc) as s
where row_number % 2 = :i;
\o

--通过他生成两个脚本
psql -v i=0 -f make-script.sql
psql -v i=1 -f make-script.sql

--最后，我们并行运行这两个工作，如下：
psql -f script-0.sql &
psql -f script-1.sql &
```

## 更换列的类型

```
alter table birthday
alter column dob set data type date
using date(to_date(dob::text,'YYMMDD') -
(case when dob/10000 between 16 and 69
then interval '100 years'
else interval '0' end));
```

## 查询某用户是否连接到数据库

```
select datname from pg_stat_activity where usename='demo';
```

## 我希望知道“这台电脑连接了吗”

```
select datname,usename,client_addr,client_port,application_name from pg_stat_activity;
```

## 如何在 psql 中反复执行某个查询

```
使用元命令
\watch
先写入查询语句，然后执行
\watch 5
代表每5秒执行一次
使用Ctrl + C退出
```

## 检查哪个查询在运行

```
首先配置文件postgresql.conf中需要设置track_activities=on;或
使用sql语句设置set track_activities = on
select datname,usename,state,query from pg_stat_activity;
```

## 获取运行时间超过 1 分钟的语句

```
select current_timestamp -query_start as runtime,
datname,usename,query
from pg_stat_activity
where state='active'
and current_timestamp - query_start > '1 min'
order by 1 desc;
```

## 检查哪个查询正在运行或被阻塞

```
select datname,usename,query from pg_stat_activity where waiting =true;
```

## 确定谁阻塞了一个查询

```
select w.query as waiting_query,w.pid as waiting_pid,w.usename as waiting_user,l.query as locking_query,l.pid as locking_pid,l.usename as locking_user,t.schemaname || '.' || t.relname as tablename
from pg_stat_activity w
join pg_locks l1 on w.pid = l1.pid and not l1.granted
join pg_locks l2 on l1.relation = l2.relation and l2.granted
join pg_stat_activity l on l2.pid = l.pid
join pg_stat_user_tables t on l1.relation = t.relid
where w.waiting;
```

## 杀死在事务中空闲的查询

```
select pg_terminate_backend(pid)
from pg_stat_activity
where state='idle in transaction'
and current_timestamp - query_start > '10 min';

```

## 理解查询变慢的原因

```
首先，查看监控工具，查询cpu，内存，磁盘性能是否有变化
然后分析你的数据库，使用analyse;

如何改善了目前的表现，就意味着autovacuum没有工作很好。
（1）查询返回的数据比之前明显多很多吗？
（2）查询是否单独运行时很慢？关闭其它应用连接，在数据库中进行查询，确定是否服务器已经超负荷了。记着，百万的数据0.3秒就可以完成
（3）表和索引膨胀，使用这个语句判断

select pg_relation_size(relid) as tablesize,schemaname,relname,n_live_tup from pg_stat_user_tables where relname = <tablename>;

pgBadger可以分析日志，生成查询耗时报表
```

## 分析查询性能

```
安装pg_stat_statements,我使用的Postgresql94，在centos7系统中，执行
yum install postgresql94-contrib
即可

需要在postgresql.conf中配置
shared_preload_libraries = 'pg_stat_statements'

在数据库中执行
create extension pg_stat_statements;

select query,calls from pg_stat_statements order by calls desc;
```

## 查询有多少活动连接

```
select count(*) from pg_stat_activity;
```

## 解决占用连接的空闲查询

```
select pg_terminate_backend(pid)
from pg_stat_activity
where state='idle'
and current_timestamp - query_start > '30 min';
```

## postgresql 运行在独立模式

```
postgresql --single -D /ful/path/to/datadir postgres
```

## 执行清理动作

```
清理数据库
vacuumdb postgres
自动清理命令
vacuum
```

## 重建索引

```
单数据库
reindexdb
所有数据库
reindexdb -a
```

## 查询未被使用得索引

```
select schemaname,relname,indexrelname,idx_scan from pg_stat_user_indexes order by idx_scan;
```

## 谨慎删除不必要的索引

```
(1),首先，建立以下函数：
create or replace function trial_drop_index(index text)
return void
language sql as $$
update pg_index
set indisvalid = false
where indexrelid = $1::regclass;
$$;
(2),然后，运行它来做一个删除索引的实验

```

## 修改数据库表拥有者脚本

```
#!/bin/bash

usage()
{
cat << EOF
usage: $0 options

This script set ownership for all table, sequence and views for a given database

Credit: Based on http://stackoverflow.com/a/2686185/305019 by Alex Soto
        Also merged changes from @sharoonthomas

OPTIONS:
   -h      Show this message
   -d      Database name
   -o      Owner
EOF
}

DB_NAME=
NEW_OWNER=
PGSQL_USER=postgres

while getopts "hd:o:" OPTION
do
    case $OPTION in
        h)
            usage
            exit 1
            ;;
        d)
            DB_NAME=$OPTARG
            ;;
        o)
            NEW_OWNER=$OPTARG
            ;;
    esac
done

if [[ -z $DB_NAME ]] || [[ -z $NEW_OWNER ]]
then
     usage
     exit 1
fi

for tbl in `psql -U $PGSQL_USER -qAt -c "select tablename from pg_tables where schemaname = 'public';" ${DB_NAME}` \
           `psql -U $PGSQL_USER -qAt -c "select sequence_name from information_schema.sequences where sequence_schema = 'public';" ${DB_NAME}` \
           `psql -U $PGSQL_USER -qAt -c "select table_name from information_schema.views where table_schema = 'public';" ${DB_NAME}` ;
do
    psql -U $PGSQL_USER -c "alter table \"$tbl\" owner to ${NEW_OWNER}" ${DB_NAME} ;
done
```

## postgresql 启用 SSL

```
1，申请服务器证书，确保"Common Name"为数据库用户名
openssl req -new -text -out server.req
2，为了去除密码，执行
openssl rsa -in privkey.pem -out server.key
rm privkey.pem
3，基于 server.key 生成服务器证书
openssl req -x509 -in server.req -text -key server.key -out server.crt
4，修改 server.key 的权限
chmod og-rwx server.key
5，为了得到自己的证书，把生成的服务器证书作为受信任的根证书，只需要复制并取一个合适的名字
cp server.crt root.crt
6，三个文件放置到 pgdata 目录下，在 postgresql.conf 开启 ssl
7，修改 postgresql.conf 文件
ssl = on
ssl_ca_file = 'root.crt'
8，修改 pg_hba.conf 文件
hostssl all webadmin 192.168.1.0/24 md5 clientcert=1
9，重启 postgresql 数据库
systemctl restart postgresql9.4
10，客户端证书
生成客户端私钥，参考服务器端
openssl genrsa -des3 -out /tmp/postgresql.key 1024
openssl rsa -in /tmp/postgresql.key -out /tmp/postgresql.key
11，为 PostgreSQL 数据库用户创建 SSL 证书并且使用服务器上的  root.crt  文件来签名
openssl req -new -key /tmp/postgresql.key -out /tmp/postgresql.csr -subj '/C=CN/ST=Henan/L=Zhengzhou/O=Msyy/CN=tdmsyy/emailAddress=eagle@joyoio.com'
openssl x509 -req -in /tmp/postgresql.csr -CA root.crt -CAkey server.key -out /tmp/postgresql.crt -CAcreateserial
12，将准备好的三个文件（postgresql.key, postgresql.crt, root.crt）放置到客户机的.postgresql 文件夹下面
 chmod 0400 ~/.postgresql/postgresql.key
```

## 将 sqlite3 数据库导入到 postgresql 中

```
sqlite3 mjsqlite.db .dump|tee -i mypg.sql
```

修改表结构 SQLITE3 到 PG

```
sed -i 's/integer primary key autoincrement/serial primary key/g;s/PRAGMA foreign_keys=OFF;//;s/datetime/timestamp/g;s/tinyint/smallint/g' mypg.sql
```

然后使用下面的语句进行导入

```
psql -d database -U username -W < /the/path/to/sqlite-dumpfile.sql
```

设置某个表的自增主键，防止报错：duplicated key not allowed

```
select max(id) from w_user_points;
select nextval('w_user_points_id_seq');
select setval('w_user_points_id_seq',2631);
```
