ARG BASE_IMAGE="ubuntu:18.04"
ARG ADMINUSER="JockDaRock"
ARG ADMINNAME0="Jock"
ARG ADMINNAME1="DaRock"
ARG ADMINPASS="password"

#########Desktop-Build############

FROM ${BASE_IMAGE}
# NOTE: ARCH must be defined again after FROM
# https://docs.docker.com/engine/reference/builder/#scope
ARG ARCH="amd64"

# setting DEBIAN_FRONTEND=noninteractive stops some apt warnings, this is not
# a real argument, we're (ab)using ARG to get a temporary ENV again.
ARG DEBIAN_FRONTEND=noninteractive

COPY clean-install /usr/local/bin/clean-install
RUN chmod +x /usr/local/bin/clean-install

# Get dependencies
# The base image already has: ssh, apt, snapd
# This is broken down into (each on a line):
# - packages necessary for installing docker
# - packages needed to run services (systemd)
# - packages needed for docker / hyperkube / kubernetes components
# - misc packages (utilities we use in our own tooling)
# Then we cleanup (removing unwanted systemd services)
# Finally we disable kmsg in journald
# https://developers.redhat.com/blog/2014/05/05/running-systemd-within-docker-container/
RUN clean-install \
      apt-transport-https ca-certificates curl software-properties-common gnupg2 lsb-release \
      systemd systemd-sysv libsystemd0 \
      conntrack iptables iproute2 ethtool socat util-linux mount ebtables udev kmod aufs-tools \
      bash rsync

# Install docker, which needs to happen after we install some of the packages above
# based on https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository
# and https://kubernetes.io/docs/setup/independent/install-kubeadm/#installing-docker
# - get docker's GPG key
# - add the fingerprint
# - add the repository
# - update apt, install docker, cleanup
# NOTE: 18.06 is officially supported by Kubernetes currently, so we pin to that.
# https://kubernetes.io/docs/tasks/tools/install-kubeadm/
ARG DOCKER_VERSION="18.06.*"
# another temporary env, not a real argument. setting this to a non-zero value
# silences this warning from apt-key:
# "Warning: apt-key output should not be parsed (stdout is not a terminal)"
ARG APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE="false"
RUN curl -fsSL "https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg" | apt-key add - \
    && apt-key fingerprint 0EBFCD88 \
    && ARCH="${ARCH}" add-apt-repository \
        "deb [arch=${ARCH}] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" \
    && clean-install "docker-ce=${DOCKER_VERSION}"

# Install CNI binaries to /opt/cni/bin
# TODO(bentheelder): doc why / what here
ARG CNI_VERSION="0.6.0"
ARG CNI_TARBALL="cni-plugins-${ARCH}-v${CNI_VERSION}.tgz"
ARG CNI_BASE_URL="https://storage.googleapis.com/kubernetes-release/network-plugins/"
ARG CNI_URL="${CNI_BASE_URL}${CNI_TARBALL}"
RUN curl -sSL --retry 5 --output /tmp/cni.tgz "${CNI_URL}" \
    && sha256sum /tmp/cni.tgz \
    && mkdir -p /opt/cni/bin \
    && tar -C /opt/cni/bin -xzf /tmp/cni.tgz \
    && rm -rf /tmp/cni.tgz

# tell systemd that it is in docker (it will check for the container env)
# https://www.freedesktop.org/wiki/Software/systemd/ContainerInterface/
# ENV container docker

# systemd exits on SIGRTMIN+3, not SIGTERM (which re-executes it)
# https://bugzilla.redhat.com/show_bug.cgi?id=1201657
STOPSIGNAL SIGRTMIN+3

# Install XORG
#RUN install_packages xserver-xorg=1:7.7+19 \
RUN apt update && apt install -y \
  xserver-xorg \
  xserver-xorg-input-all \
  xinit \
  x11-xserver-utils \
  dbus-x11 \
  matchbox-keyboard \
  xterm \
  apt-transport-https \
  curl

# Install Desktop and Snap Components
RUN apt install -y gnome-shell ubuntu-gnome-desktop
RUN apt install -y sudo linux-image-generic squashfs-tools squashfuse fuse snapd

# Install VSCode Editor
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
    && install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/ \
    && sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list' \
    #&& apt-get install apt-transport-https \
    #&& clean-install code
    && apt-get update \
    && apt-get install code

# Install Chrome Browser and Ubuntu Software App
RUN clean-install ubuntu-software
RUN clean-install chromium-browser

# tell systemd that it is in docker (it will check for the container env)
# https://www.freedesktop.org/wiki/Software/systemd/ContainerInterface/
ENV container docker
ENV PATH "$PATH:/snap/bin"

# Add user accounts
#RUN adduser $ADMINUSER --gecos "$ADMINUSER,RoomNumber,WorkPhone,HomePhone" --disabled-password
#RUN echo "$ADMINUSER:$ADMINPASS" | chpasswd
#RUN usermod -aG sudo $ADMINUSER

ARG ADMINUSER="JockDaRock"
ARG ADMINNAME0="Jock"
ARG ADMINNAME1="DaRock"
ARG ADMINPASS="password"

COPY user_add.sh user_add.sh
RUN chmod +x user_add.sh && ./user_add.sh "${ADMINUSER}" "${ADMINNAME0}" "${ADMINNAME1}" "${ADMINPASS}"

ENTRYPOINT [ "/sbin/init" ]

VOLUME [ "/var/lib/docker" ]
