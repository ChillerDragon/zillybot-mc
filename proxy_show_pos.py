#!/usr/bin/env python3

"""
"Show Pos" debug proxy

based on https://github.com/barneygale/quarry/blob/9a6872013294ecb4fba18a57c991793d6023c48c/examples/proxy_hide_chat.py
and inspired by https://github.com/barneygale/quarry/blob/9a6872013294ecb4fba18a57c991793d6023c48c/examples/proxy_hide_chat.py

This proxy does not really belong to the zillybot.js client.
But its also not worth its own repository. So seems like I start collecting all the LiveOverflow simp things in this repo now.
"""

from twisted.internet import reactor
from quarry.types.uuid import UUID
from quarry.net.proxy import DownstreamFactory, Bridge

import struct


class QuietBridge(Bridge):
    quiet_mode = False

    def packet_unhandled(self, buff, direction, name):
        if direction == "upstream":
            details = ''
            if name == 'player_position':
                # details = buff.read()
                # buf = buff.read()
                # x, y, z = buff.unpack_position()
                # buff.pack_position(x, y, z)
                # x, y, z = struct.unpack('>ddd', buf)
                # details = f"details {x} {y} {z}"
                # details = f"details {buf.hex()}"
                details = 'fml'
            print(f"[*][{direction}] {name} {details}")
        return super().packet_unhandled(buff, direction, name)

    def packet_upstream_tab_complete(self, buff):
        # Unpack the packet
        print("tab comepelete")
        p_text = buff.unpack_string()

        # Do a custom thing
        if p_text.startswith("/h"):
            return # Drop the packet

        # Forward the packet
        buff.restore()
        self.upstream.send_packet("tab_complete", buff.read())

    def packet_upstream_player_position(self, buff):
        buff.save()
        p_pos_look = buff.unpack('dddB')
        print(f"[*][upstream-hook][positon] {p_pos_look[0]} {p_pos_look[1]} {p_pos_look[2]}")
        buff.restore()
        self.upstream.send_packet('player_position', buff.read())

    def packet_upstream_player_position_and_look(self, buff):
        buff.save()
        p_pos_look = buff.unpack('dddff')
        print(f"[*][upstream-hook][positon_and_look] {p_pos_look[0]} {p_pos_look[1]} {p_pos_look[2]}")
        buff.restore()
        self.upstream.send_packet('player_position_and_look', buff.read())
        # x, y, z = buff.unpack_position()
        # # print(f"position {x}")
        # buff.restore()

    def packet_upstream_chat_command(self, buff):
        command = buff.unpack_string()

        if command == "quiet":
            self.toggle_quiet_mode()
            buff.discard()

        else:
            buff.restore()
            self.upstream.send_packet("chat_command", buff.read())

    def packet_upstream_chat_message(self, buff):
        buff.save()
        chat_message = self.read_chat(buff, "upstream")
        self.logger.info(" >> %s" % chat_message)

        if chat_message.startswith("/quiet"):
            self.toggle_quiet_mode()

        elif self.quiet_mode and not chat_message.startswith("/"):
            # Don't let the player send chat messages in quiet mode
            msg = "Can't send messages while in quiet mode"
            self.send_system(msg)

        else:
            # Pass to upstream
            buff.restore()
            self.upstream.send_packet("chat_message", buff.read())

    def toggle_quiet_mode(self):
        # Switch mode
        self.quiet_mode = not self.quiet_mode

        action = self.quiet_mode and "enabled" or "disabled"
        msg = "Quiet mode %s" % action

        self.send_system(msg)

    def packet_downstream_chat_message(self, buff):
        chat_message = self.read_chat(buff, "downstream")
        self.logger.info(" :: %s" % chat_message)

        if chat_message is not None and self.quiet_mode and chat_message.startswith("<"):
            # Ignore message we're in quiet mode and it looks like chat
            pass

        else:
            # Pass to downstream
            buff.restore()
            self.downstream.send_packet("chat_message", buff.read())

    def read_chat(self, buff, direction):
        buff.save()
        if direction == "upstream":
            p_text = buff.unpack_string()
            buff.discard()

            return p_text
        elif direction == "downstream":
            p_text = buff.unpack_chat().to_string()
            p_unsigned_text = None
            p_position = 0

            # 1.19+
            if self.downstream.protocol_version >= 759:
                if buff.unpack('?'):
                    p_unsigned_text = buff.unpack_chat().to_string()

                p_position = buff.unpack_varint()
                p_sender_uuid = buff.unpack_uuid()
                p_sender_name = buff.unpack_chat()
                buff.discard()

                if p_position not in (1, 2):  # Ignore system and game info messages
                    # Sender name is now sent separately to the message text
                    return "<%s> %s" % (p_sender_name, p_text or p_unsigned_text)

            elif self.downstream.protocol_version >= 47:  # 1.8.x+
                p_position = buff.unpack('B')
                buff.discard()

                if p_position not in (1, 2) and p_text.strip():  # Ignore system and game info messages
                    return p_text

            else:
                return p_text

    def send_system(self, message):
        # 1.19+, use system message packet
        if self.downstream.protocol_version >= 759:
            self.downstream.send_packet("system_message",
                                        self.downstream.buff_type.pack_chat(message),
                                        self.downstream.buff_type.pack_varint(1))
        else:
            self.downstream.send_packet("chat_message",
                                        self.downstream.buff_type.pack_chat(message),
                                        self.downstream.buff_type.pack('B', 0),
                                        self.downstream.buff_type.pack_uuid(UUID(int=0)))


class QuietDownstreamFactory(DownstreamFactory):
    bridge_class = QuietBridge
    motd = "Proxy Server"


def main(argv):
    # Parse options
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("-a", "--listen-host", default="", help="address to listen on")
    parser.add_argument("-p", "--listen-port", default=25565, type=int, help="port to listen on")
    parser.add_argument("-b", "--connect-host", default="127.0.0.1", help="address to connect to")
    parser.add_argument("-q", "--connect-port", default=25565, type=int, help="port to connect to")
    args = parser.parse_args(argv)

    # Create factory
    factory = QuietDownstreamFactory()
    factory.connect_host = args.connect_host
    factory.connect_port = args.connect_port

    # Listen
    factory.listen(args.listen_host, args.listen_port)
    reactor.run()


if __name__ == "__main__":
    import sys
    main(sys.argv[1:])
