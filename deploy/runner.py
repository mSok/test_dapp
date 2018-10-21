import os
import sys
import zipfile
import getpass
import subprocess
import json

PATH_TO_KEYS = './keys.zip'
DATA_DIR = '~/eth2/chaindata/'
ADMIN_WALLET = 'e1684dd2a840997ddbd8fd58c60c9289ef4759c1'

def setup():
    """ Run geth """
    chain_dir = os.path.expanduser(DATA_DIR)
    key_store = os.path.join(chain_dir, 'keystore')

    os.makedirs(key_store , exist_ok=True)

    if not ([name for name in os.listdir(key_store) if name.endswith(ADMIN_WALLET)]):
        zip_ref = zipfile.ZipFile(PATH_TO_KEYS, 'r')
        pswd = getpass.getpass('Password:')
        zip_ref.extractall(key_store, pwd=pswd.encode('cp850','replace'))
        zip_ref.close()

    # geth -datadir /path/to/data/dir init /path/to/genesis.json
    gen_file = os.path.join('genesis.json')
    cmd_init = 'geth --datadir {} init ./genesis.json'.format(
        DATA_DIR
    )
    subprocess.run(cmd_init, shell=True)

    cmd_run = 'geth --datadir {} --rpc --rpcapi="db,eth,net,web3,personal,web3" --rpcaddr "{}"  --rpccorsdomain="*" --networkid 15 --minerthreads 1'.format(
        DATA_DIR,
        sys.argv[1] if len(sys.argv) > 1 else '0.0.0.0'
    )
    print('init finish')
    subprocess.run(cmd_run, shell=True)
    print("Finish")


def deploy():
    cmd_placemarket_bin = 'solc --bin ./../contracts/SitisPlaceMarket.sol --combined-json abi,bin,interface -o ./compile/PlaceMarket --overwrite'
    subprocess.run(cmd_placemarket_bin, shell=True)
    print('-' * 60)
    cmd_arbitr_bin = 'solc --bin ./../contracts/SitisArbitration.sol --combined-json abi,bin,interface -o ./compile/PlaceMarket --overwrite'
    stt = subprocess.run(cmd_arbitr_bin, shell=True, stdout=subprocess.PIPE)

    with open('./compile/PlaceArbitration/combined.json') as infile:
        data = json.load(infile)


if __name__ == '__main__':
    if os.path.dirname(sys.argv[0]) != os.getcwd():
        os.chdir(os.path.dirname(sys.argv[0]))
    try:
        subprocess.run('solc --version', shell=True)
    except FileNotFoundError as exc:
        print ('''\n
        Install solc for deploy contracts. 
            sudo add-apt-repository ppa:ethereum/ethereum
            sudo apt-get update
            sudo apt-get install solc
        ''')
    # setup()
    deploy()