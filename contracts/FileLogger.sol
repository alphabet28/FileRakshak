// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileLogger {
    struct File {
        address uploader;
        uint256 timestamp;
    }

    mapping(bytes32 => File) public files;

    event FileUploaded(bytes32 indexed fileHash, address indexed uploader, uint256 timestamp);

    function uploadFileHash(bytes32 fileHash) external {
        require(files[fileHash].timestamp == 0, "Already uploaded");

        files[fileHash] = File(msg.sender, block.timestamp);
        emit FileUploaded(fileHash, msg.sender, block.timestamp);
    }

    function getFile(bytes32 fileHash) public view returns (address, uint256) {
        File memory file = files[fileHash];
        return (file.uploader, file.timestamp);
    }
}
