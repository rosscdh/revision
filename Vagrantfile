Vagrant.configure("2") do |config|
    config.vm.host_name = "revision.vm"
    config.vm.network :private_network, ip: "10.40.40.40"
    config.vm.synced_folder ".", "/home/vagrant/revision", type: "nfs"
    config.vm.provision "shell", path: "provision.sh"

    config.vm.provider "virtualbox" do |vb, override|
        override.vm.box = "hashicorp/precise64"
        vb.customize ["modifyvm", :id, "--memory", "1024"]
    end
    config.vm.provider "parallels" do |p, override|
        override.vm.box = 'parallels/ubuntu-12.04'
        p.memory = 1024
    end
end
