FROM node:14
WORKDIR /app
COPY . .
RUN npm install
RUN apt-get update
RUN apt-get update
RUN apt-get install mariadb-server -y
RUN service mysql start
RUN mkdir /codes
RUN pwd
RUN ls -lart
RUN useradd -ms /bin/bash wolverine

# Grant permissions to wolverine user
RUN mkdir /etc/sudoers.d && \
    echo "wolverine ALL=(ALL) NOPASSWD: /usr/sbin/service mysql start, /usr/sbin/service mysql stop" >> /etc/sudoers.d/wolverine && \
    chmod 0440 /etc/sudoers.d/wolverine

# USER wolverine
# RUN chown wolverine:wolverine /run/mysqld/mysqld.pid
# RUN chown wolverine:wolverine /var/run/mysqld
# RUN chown wolverine:wolverine /var/run/mysqld/mysqld.sock
# RUN chown wolverine:wolverine /usr/bin/mariadb
# RUN chown wolverine:wolverine /var/lib/mysql
# RUN chmod -R + /var/run/mysqld
# RUN chmod -R + /var/run/mysqld/mysqld.sock
# RUN chmod 777 /var/run/mysqld/mysqld.sock
# RUN chmod -R + /usr/bin/mariadb
# RUN chmod -R + /var/lib/mysql


# RUN groupadd -g 1001 mariadb \
#     && useradd -u 1001 -g 1001 -s /sbin/nologin mariadb \
#     && chown -R mariadb:mariadb /var/lib/mysql \
#     && chmod 700 /var/lib/mysql
# USER mariadb


# RUN chown -R limiteduser:limiteduser /app/codes && \
#     chmod -R 700 /app/codes





CMD ["npm", "run", "start"]

